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
![Image](https://drive.google.com/uc?export=view&id=1thyswONiKoallqoB-pyDQB3BzeEEKHxQ)

Go to a folder, open a terminal window there and clone it using the URL.
![Image](https://drive.google.com/uc?export=view&id=1N4Tv5dcUJasba5up1d-AlIUC5_yR_b6v)

If everything is okay, you should see the same lines as in the screenshot above, which would mean that the repository has been cloned successfully.
If something goes wrong, it means you did something wrong - which means you have to go back and correct it.

Note: As you can see this is SSH based communication with GitHub. It is the more appropriate way.
Setting it up is not rocket science. You just have to create an SSH key and configure it to your
account. There are many intuitive guides on how to do it.

### 2. Branching

Every repository has a default branch - which is like a source of truth for the code in it. However if you all work on this branch, 
you will interrupt each other and mess up each other's changes. That's why it's a good idea to do it sequentially. 

But if you do it sequentially, don't you need to always ask the others? Not necessarily - enter branches. Branches are a good way to
"branch" your work, creating one more copy of the source of truth and introducing changes upon it. Branches help you because you don't
need to constantly sync up with the others' work - you would need to do that once at the end when you are ready with your work.

You can check all local branches, as well as which branch you are currently on, by opening a terminal in the repository and doing this:
![Image](https://drive.google.com/uc?export=view&id=10xlJIYhgrmUP-RHcPDHP0pVNAcM9deiQ)

It should result in this:
![Image](https://drive.google.com/uc?export=view&id=1nP2BRCxBx-UlxIA8LBkjGYt8xNar-hiN)

Note: git commands often direct you to a vim interface. There is a running joke with "How to exit vim?" in the tech newbie world.
In this case you can just press "Q".

To create your own branch, simply go in the root folder of the repository, open a terminal and do this:
![Image](https://drive.google.com/uc?export=view&id=1DWp9cqaPwqDGgqiQOMgvm3GILl11EBEE)

Branches can be local and remote. Remote branches are branches that are pushed to the cloud (GitHub). If something is not pushed to the cloud it is only on your computer.
To create the branch on the cloud, simply open a terminal and do this:
![Image](https://drive.google.com/uc?export=view&id=1DdEv9rBlBb_pAKqBAx3UBpw6-9mwDoQT)

You can then verify that it was created on the cloud from the web interface:
![Image](https://drive.google.com/uc?export=view&id=1qGsjnk7eBQ9DAwGGGgU3HFfLBs-AvQ-a)

To switch to another branch, simply open a terminal and do this:
![Image](https://drive.google.com/uc?export=view&id=1buRQT_T9EGCEKMV2j60HES1zb3RX0Lza)

### 3. Staging changes

You can always check what changes are currently waiting to be staged, by typing the following command:
![Image](https://drive.google.com/uc?export=view&id=1vjwBlbwf1mgau2Obj631d5eDcrDUSCh7)

Whatever is staged as a change will be committed. You don't always want to commit everything you change. Add only the things you want to commit.
![Image](https://drive.google.com/uc?export=view&id=1N9JySrm_d6X6Wo9GQG1zuJ3h-OA8RipX)

### 4. Committing changes

Committing is the act of registering changes to the repository. When you create a commit you create a change in the version history.
![Image](https://drive.google.com/uc?export=view&id=1derZ5_re2qoOeC78J1IsnG52NupzCu2X)

You can check the current branch's commit history by doing this:
![Image](https://drive.google.com/uc?export=view&id=1NwiL_kDehgAhNfbxN_tsKRA5YeHOckok)

It should result in this:
![Image](https://drive.google.com/uc?export=view&id=1QbL4jTBiT7PJEUI-f3bJ9_FokwT3LRzO)

### 5. Pushing changes

Committed changes are only on the local repository first, you need to push them in order to affect the remote repository.
![Image](https://drive.google.com/uc?export=view&id=1v5u3GunrBNsD-3JUpAkm6LT97PNCM_a8)

You can then verify that it was pushed on the cloud from the web interface:
![Image](https://drive.google.com/uc?export=view&id=1rJhCz_Mh5hqZyR65dphgm5OLhnG4HkW1)

Be careful with what you push, as it goes up to the cloud.

### 6. Merging & Conflicts

As people working in a revision, there is always the possibility of running into a conflict. Branches are a great way
to work in parallel, but when 2 people touch the same files and the same lines in those files we run into a conflict.


Conflicts are not scary, they are a completely normal phenomenon.
![Image](https://drive.google.com/uc?export=view&id=1EGwrB27ZxFQeEd9CzZPKoPVFdY3JUVcJ)

Git is a pretty mature and sophisticated system and it outlines the conflict with both sides. Resolving a conflict is 
basically deciding which of the 2 sides to keep and which to delete. 
There is also the possibility of wanting to keep both sides, that's also possible.

### Conclusion

Working with Git is not hard at all. This tutorial should cover the sanitary minimum of basic needs to 
work with Git. 