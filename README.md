# generative-radio

To use the generative radio you have to:

* Request *Freesound* access credentials from https://freesound.org/apiv2/apply (an account is required).
* Copy the *Client secret/Api key* (token) and add it to */js/globals.js*.
* Upload all files on a server or use a server solution stack such as [*MAMP*](https://www.mamp.info/) or [*XAMPP*](https://www.apachefriends.org/).
   Instructions for *MAMP*:
  * Download, install and launch *MAMP*.
  * Open to *MAMP*'s *Preferences* (press ```⌘,```) and click on the *Web-Server* tab.
  * Click the folder icon next to *Document Root* and select the *generative-radio* folder.
  * Click *OK* and *Start Server*.
  * A website will open, click *My Website* on the top left or go to [localhost:8888/](localhost:8888/).
* Change the content of *pieces.json* to get different results.
* If you get an "Error while searching..." message, try to clear the browsers cache and refresh the page.
  * On *Chrome*: Open the *Developer Tools*, right-click on the refresh button (on the left side of the url) and select *Empty Cache and Hard Reload*.
  * On *Safari*: Click *Develop* on the menu bar (developer menu has to be enabled), select *Empty Caches* ```⌥⌘E``` and refresh the page.
