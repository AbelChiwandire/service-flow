import assert from 'node:assert/strict';
import { neon } from '@neondatabase/serverless';
import {
    createJob,
    updateJob,
    deleteJob,
    JobCustomerNotFoundError,
    ActiveJobDeleteError,
} from '@/lib/db/jobs/repository';

const sql = neon(process.env.DATABASE_URL!);

// The seeded test user
const USER_ID = '00000000-0000-0000-0000-000000000001';
const OTHER_USER_ID = '11111111-1111-1111-1111-111111111111';
const MISSING_JOB_ID = '00000000-0000-0000-0000-00000000dead';

async function main() {
    // Set up a customer directly in SQL so this script doesn't depend on customer code
    const [customer] = await sql`
        INSERT INTO customers ("userId", name, email, phone, address)
        VALUES (${USER_ID}, 'Job Test Customer', 'jobtest@example.com', '555-0000', '1 Test Street')
        RETURNING id
    `;
    const customerId = customer.id as string;

    try {
        // Create, and inspect what the driver returns for DATE
        const job = await createJob({
            userId: USER_ID,
            customerId,
            title: 'Initial title',
            description: 'Initial description',
            scheduledDate: '2026-10-15',
        });
        console.log('created:', job);
        console.log('scheduledDate ->', typeof job.scheduledDate, job.scheduledDate);
        assert.equal(job.status, 'scheduled'); // DB default applied

        // Omitted fields are kept
        const titleOnly = await updateJob(USER_ID, job.id, { title: 'New title' });
        assert.equal(titleOnly?.title, 'New title');
        assert.equal(titleOnly?.description, 'Initial description');
        assert.notEqual(titleOnly?.scheduledDate, null);

        // Explicit null clears description, other fields untouched
        const descCleared = await updateJob(USER_ID, job.id, { description: null });
        assert.equal(descCleared?.description, null);
        assert.equal(descCleared?.title, 'New title');

        // Explicit null clears scheduledDate
        const dateCleared = await updateJob(USER_ID, job.id, { scheduledDate: null });
        assert.equal(dateCleared?.scheduledDate, null);

        // Setting a value again after clearing works
        const descRestored = await updateJob(USER_ID, job.id, { description: 'Back again' });
        assert.equal(descRestored?.description, 'Back again');

        // Ownership: another user can't create a job on this customer or update this job
        await assert.rejects(
            () => createJob({ userId: OTHER_USER_ID, customerId, title: 'x' }),
            JobCustomerNotFoundError
        );
        assert.equal(await updateJob(OTHER_USER_ID, job.id, { title: 'hijack' }), null);

        // Active jobs can't be deleted
        await assert.rejects(() => deleteJob(USER_ID, job.id), ActiveJobDeleteError);

        // Non-existent job returns null, not an error
        assert.equal(await deleteJob(USER_ID, MISSING_JOB_ID), null);

        // Cancel, then delete succeeds
        await updateJob(USER_ID, job.id, { status: 'cancelled' });
        const deleted = await deleteJob(USER_ID, job.id);
        assert.equal(deleted?.isDeleted, true);

        console.log('All checks passed');
    } finally {
        // Cleanup runs even if an assertion failed partway through.
        // Hard deletes are fine here: these are throwaway test rows, and jobs must go
        // first because jobs.customerId is ON DELETE RESTRICT.
        await sql`DELETE FROM jobs WHERE "customerId" = ${customerId}`;
        await sql`DELETE FROM customers WHERE id = ${customerId}`;
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});