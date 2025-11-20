function randomName() {
    const names = ["John", "Alice", "Bob", "Michael", "Sophia", "Emma", "Noah"];
    return names[Math.floor(Math.random() * names.length)] + " Tester";
}

function randomEmail() {
    return "user" + Math.floor(Math.random() * 10000) + "@example.com";
}

function beforeRequest(req, ctx, ee, next) {
    ctx.vars.studentName = randomName();
    ctx.vars.studentEmail = randomEmail();
    next();
}