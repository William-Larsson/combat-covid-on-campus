## Before you start coding
Checkout to the *main* branch and run the  
> git pull

command to get the latest changes. 

Now, you want to create a new branch to work on. Run 
> git checkout -b \<branch-name\> 
  
to create a new branch and switch to it from *main*. Replace \<branch-name\> with something readable like *my-feature* 

Now you can start coding!

## Committing your changes and additions
Firstly, run the basic
> git status

command to see the all the files that you have changed. 

If you want to add all of them to the upcoming commit, simply run 
> git add .

Otherwise, individual files can be added with
> git add \<file-name\>
  
and removed if wrongfully added with
> git remove \<file-name\>

After the files have been added, they can be committed with
> git commit -m "An example commit message"

## Pushing your changes to GitHub
Begin by switching branch to the *main* branch
> git checkout main

Do a pull to make sure that main hasn't changed since your last pull
> git pull

If there is a conflict happening after doing the pull, then read section **Merge changes from main to your branch**. Return here afterwards. 

Now. you should be able to simply run:
> git push --set-upstream origin \<branch-name\>
  
to push this change to GitHub. This is still not a part of the *main* branch, so you will need to create a *Pull-request*.

## Merge changes from main to your branch 
A conflict has happened, which means that the some lines of code has been changed in *main* since your last pull, and you have made changes to those same lines too. 

You need to resolve all the conflicts. This process can be different in different tools/editors. 

When the conflicts are resolved, let's 
> git status

The returned prompt should say that you have unmerged paths. This is ok, you have already solved this, so now you should commit that solution. 
> git add . 

> git commit 

**Note!** 
If a long text prompt appears, them simply press *Esc* followed by
> :wq

and hit *Enter*. This will complete the commit.

Return to **Pushing your changes to GitHub**.

## Create a pull-request on GitHub. 
Go to the project repo at github.com.

You should see a pop-up windows saying *"Your recently pushed branch"*. Click the button that says **Compare & pull request**. 

To create the pull-request, click the **Create pull request**-button. Now you can add a title and comment about the request. When done, click **Send pull request**. 

Now, the changes can be reviewed by other team members, and merged on to the main-branch! 
Well done!

