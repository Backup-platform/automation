# Working with Git & GitHub

As our automation codebase is currently hosted in GitHub, you will need to learn how to work with it.
And we will do it in the most primitive way - no complex GUIs, just plain old terminal (CMD / Git Bash / whatever) style.

## Fundamentals of Git & GitHub

* Git is the version control system. 
* GitHub is a cloud-based platform for version control.
* Repositories are the main modules holding something that is versioned in GitHub.
* Storing your code in a cloud (like GitHub) is necessary. Imagine your computer breaks down, what then? "The dog ate my homework"...
* Making changes is done through creating local copies of the source code in the cloud. That way you are not interrupting the others.
* You can also review the changes of others (yours will be reviewed too), to ensure maximum code quality & minimum change integration problems.

## Working with Git & GitHub

In this section, let's explore the different steps that you will need to perform to do your work.

Note: The most secure way you can work with GitHub is via SSH keys. There's a dozen tutorials online that tell you how to set it up.
I'll leave this step to you. Look for it, try to set it up alone. If you hit a wall, there is always help in 1 question distance.

### 1. Cloning the repository

The first step is to create a local copy of the cloud repository in order to perform changes.

Get the Clone URL:
[Image]

Go to a folder, open a terminal window there and clone it using the URL.
[Image]

If everything is okay, you should see the same lines as in the screenshot above, which would mean that the repository has been cloned successfully.
If something goes wrong, it means you did something wrong - which means you have to go back and correct it.

### 2. Branching

Every repository has a default branch - which is like a source of truth for the code in it. However if you all work on this branch, 
you will interrupt each other and mess up each other's changes. That's why it's a good idea to do it sequentially. 

But if you do it sequentially, don't you need to always ask the others? Not necessarily - enter branches. Branches are a good way to
"branch" your work, creating one more copy of the source of truth and introducing changes upon it. Branches help you because you don't
need to constantly sync up with the others' work - you would need to do that once at the end when you are ready with your work.

You can check all branches, as well as which branch you are currently on, by opening a terminal in the repository and doing this:
[Image]

To create your own branch, simply go in the root folder of the repository, open a terminal and do this:
[Image]

Branches can be local and remote. Remote branches are branches that are pushed to the cloud (GitHub). If something is not pushed to the cloud it is only on your computer.
To create the branch on the cloud, simply open a terminal and do this:
[Image]

To switch to another branch, simply open a terminal and do this:
[Image]

### 3. Staging changes

Whatever is staged as a change will be committed. You don't always want to commit everything you change. Add only the things you want to commit.
[Image]

### 4. Committing changes

Committing is the act of registering changes to the repository. When you create a commit you create a change in the version history.
[Image]

You can check the current branch's commit history by doing this:
[Image]

### 5. Pushing changes

Committed changes are only on the local repository first, you need to push them in order to affect the remote repository.
Be careful with what you push, as it goes up to the cloud.

### 6. Merging & Conflicts

