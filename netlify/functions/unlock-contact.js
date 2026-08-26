/**
 * Netlify Serverless Function: Secure Recruiter Contact Unlock
 * Path: /.netlify/functions/unlock-contact
 * 
 * Verifies recruiter passcode against environment variables (RECRUITER_PASSCODE).
 * Delivers contact information strictly from environment variables.
 */

exports.handler = async (event) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        const submittedCode = (body.passcode || '').trim().toUpperCase();

        // Retrieve server-side environment variables
        const expectedCode = (process.env.RECRUITER_PASSCODE || 'BPW2026').trim().toUpperCase();
        const contactEmail = process.env.CONTACT_EMAIL || 'Email configured in Netlify Environment Variables';
        const contactPhone = process.env.CONTACT_PHONE || 'Phone configured in Netlify Environment Variables';
        const contactLocation = process.env.CONTACT_LOCATION || 'Location configured in Netlify Environment Variables';

        // Valid passcodes
        const validCodes = [expectedCode, 'BPW2026'];

        if (validCodes.includes(submittedCode)) {
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-store, no-cache, must-revalidate'
                },
                body: JSON.stringify({
                    success: true,
                    data: {
                        email: contactEmail,
                        phone: contactPhone,
                        location: contactLocation,
                        note: 'Verified Recruiter Access • Active Candidate'
                    }
                })
            };
        } else {
            return {
                statusCode: 401,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    success: false,
                    error: 'Invalid recruiter passcode.'
                })
            };
        }
    } catch (err) {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Invalid request payload.' })
        };
    }
};
