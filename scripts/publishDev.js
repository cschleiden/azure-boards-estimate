var exec = require("child_process").exec;

// Load existing publisher
var manifest = require("../vss-extension.json");
var extensionId = manifest.id;
var extensionPublisher = manifest.publisher;
var extensionVersion = manifest.version;
var extensionName = manifest.name;

console.log("Packaging dev package...")

// Package extension
var command = `tfx extension create --overrides-file configs/dev.json --manifest-globs vss-extension.json --extension-id ${extensionId}-dev --override "{ 'name': '${extensionName}-dev' }" --rev-version --no-prompt`;
exec(command, function (error, stdout, stderr) {
    if (error) {
        console.error(`Could not package extension: ${error}`);
        return;
    }

    console.log(stdout);
    console.log(stderr);

    console.log("Package created.");

    console.log("Publishing dev package to the marketplace...")

    // Package extension
    var command = `tfx extension publish --vsix ${extensionPublisher}.${extensionId}-dev-${extensionVersion}.vsix --no-prompt`;
    exec(command, function (error, stdout, stderr) {
        if (error) {
            console.error("Error while publishing: " + error);
            return;
        }

        console.log(stdout);
        console.log(stderr);
        console.log("Package published.");
    });
});