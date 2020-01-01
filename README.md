# Azure Boards Estimate

![](https://github.com/cschleiden/azure-boards-estimate/workflows/Build%20&%20Deploy/badge.svg)

## Contributing

**Update 9/18/19**: I don't work on the `Azure Boards` team anymore so I'll have less time to work on this extension. If you want to send a PR I'll gladly review and merge it.

### Developing and Testing

<span style="color: green">To test your work, first [follow these steps to set up a DevOps marketplace publisher account](https://docs.microsoft.com/en-us/azure/devops/extend/publish/overview?view=azure-devops) (if you already have an account move on).

1. Run `npm run package-dev` and upload the package as a private extension to your  Azure DevOps publisher account
> Note: You may need to add a directory called `build` to the project root when running the script. The output of the `package-dev` script is there.
 - Be sure to update the `manifest.json` to use your publisher's ID before running the script.
2. Install the private extension on your Azure DevOps oragnization and test your changes.


## Upgrading to current version

When upgrading from the first version, you need to approve additional OAuth scopes:

<img src="https://user-images.githubusercontent.com/2201819/55303550-bc25c780-53fb-11e9-9379-0a64e3fb1014.png" width="400px" />
