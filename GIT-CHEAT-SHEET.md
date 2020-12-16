## Before you start coding
Make sure that you are on the *main* branch and run the  
> git pull

command to get the latest changes. 

If not, run
> git checkout main

before doing the pull to switch branch to *main*. 

Now, you want to create a new branch to work on. Run 
> git checkout -b \<branch-name\> 
  
to create a new branch and switch to it from *main*. Replace \<branch-name\> with something readable like *my-feature*. 

Now you can start coding!

## Committing your changes and additions
Firstly, from your branch, run the basic
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
Begin by switching from the branch you want to push to the *main* branch
> git checkout main

Do a pull to make sure that *main* hasn't changed since your last pull
> git pull

If *main* has changed since your last the pull, then read section **Merge changes from main to your branch**. Return here afterwards.

Return to your branch so the changes can be pushed
> git checkout \<branch-name\>

Now you should be able to simply run:
> git push --set-upstream origin \<branch-name\>
  
to push this update to GitHub. This is still not a part of the *main* branch, so you will need to create a *Pull-request*.

## Merge changes from main to your branch 
*Main* has changes and there are possible conflicts. A conflict means that the some lines of code have been changed in *main* since your last pull and you have made changes to those same lines too. 

Begin merging by checkout to your branch
> git checkout \<branch-name\>

Now, merge your branch with *main* by executing
> git merge main

Git may be able to auto-merge the changes if there are no conflicts. If not, you need to resolve all the conflicts manually. This process can be different in different tools/editors. 

When the conflicts are resolved, let's 
> git status

The returned prompt should say that you have unmerged paths. This is ok, you have already solved this issue, so now you should commit that solution. 
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

