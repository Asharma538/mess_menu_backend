# mess_menu_backend

## To update the Menu
### First verify on the admin portal that you're granted the write access
1. Clone the repository
2. Update the credentials in the secret_files folder's signin_params.json file
3. Change the Menu.pdf with the new Menu's Pdf file
4. Change the Menu.png with the new Menu's PNG image
5. run `npm i`, to install the dependencies
6. run `node index.js`, to run the server
7. Go in a browser and hit the url 'http://localhost:3000' to check the server
8. Simply hit the url 'http://localhost:3000/update' to update the Menu