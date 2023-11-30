const getTargetTestTypeFolder = () => {
    return process.env.TARGET_TEST_TYPE || "**";
}

const getTargetTestFlag = () => {
    return process.env.TARGET_TEST_FLAG ? "." + process.env.TARGET_TEST_FLAG : "";
}

module.exports = {
    getTargetTestTypeFolder,
    getTargetTestFlag
}