# Update - 6/21/2016 #

After the latest VSTS updates the extension should work for everyone. If not, please drop me an email, or create an issue on github.

# Easy decomposition of work items #

**Decompose** allows you to quickly break down work items into sub-hierarchies. 

- Create hierarchies of work items without waiting
- Should it be a Task or is it big enough for a Story? Promote/Demote work items easily between different hierarchy levels
- Full support for keyboard shortcuts. Just like your favorite editor (VS Code), you never have to leave the keyboard
- Iterate on titles before commiting

![Overview](marketplace/overview.png)

## Example: Starting a Sprint ##
When you start to work on a feature and you want to quickly break it down into User Stories and Tasks you can use Excel, manually create work items, or the *New Item* panel on the Backlog. This all works, but isn't as convenient as it could be. 

With **Decompose** you can easily define hierarchies, change work items between levels, and finally create actual work items with a single click.   

![Breaking down of an Epic](marketplace/quick-decompose.gif)

# Version History #

* **0.0.5** - Fixes a bug that prevented Internet Explorer users from saving

# On Premise/Team Foundation Server #

Many people have asked why this extension is only available for Team Services: it relies on APIs that will only be available in the next **major** version of Team Foundation Server. After release, I will provide a package of this extension that can be installed on an on premise Team Foundation Server, until then I can only support Team Services.

# Code #
The code is available at https://github.com/cschleiden/vsts-quick-decompose.