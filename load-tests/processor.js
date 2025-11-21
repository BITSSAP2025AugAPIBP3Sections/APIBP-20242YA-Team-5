// processor.js (Artillery v2)

// -----------------------------
// Utility functions
// -----------------------------
function randomName() {
    const names = ["John", "Alice", "Bob", "Michael", "Sophia", "Emma", "Noah"];
    return names[Math.floor(Math.random() * names.length)] + " Tester";
}

function randomEmail() {
    return "user" + Math.floor(Math.random() * 100000) + "@example.com";
}

// -----------------------------
// BEFORE REQUEST (Artillery v2)
// -----------------------------
async function beforeRequest(req, ctx, ee) {
    req.json = req.json || {};

    if (ctx.vars.studentName) {
        req.json.studentName = ctx.vars.studentName;
    }

    return req;   // no next()
}

// -----------------------------
// AFTER RESPONSE (Artillery v2)
// -----------------------------
async function captureCert(req, res, ctx, ee) {
    console.log("Full API Response:", res.body);

    let body = res.body;

    // If string → try JSON parse
    if (typeof body === "string") {
        try {
            body = JSON.parse(body);
        } catch (err) {
            body = {};
        }
    }

    if (body?.certificateNumber) {
        ctx.vars.certificateNumber = body.certificateNumber;
        ctx.vars.certCreated = true;
        console.log("Certificate captured:", body.certificateNumber);
    } else {
        ctx.vars.certCreated = false;
        console.error("Certificate NOT captured. Response:", body);
    }

    return; // no done()
}

// EXPORT BOTH
module.exports = {
    beforeRequest,
    captureCert,
    randomName,
    randomEmail
};
