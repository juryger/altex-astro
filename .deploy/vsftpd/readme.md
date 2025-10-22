## Quick notes regarding setup of vsFTPd

* create a new user `altex-uploader`
* create a folder for the user as following
`/home/altex-uploader`
* assing altex-uploader as owner with
`sudo chown altex-uploader:altex-uploader /home/altex-uploader`

* assing permission for /altex-uploader
`chmod 500 altex-uploader`

* create a subfolder `/sync` under `/etc/altex-uploader`
* assing permission for /sync
`chmod 700 sync`

For more details about setup of vsftpd see here: 
https://www.digitalocean.com/community/tutorials/how-to-set-up-vsftpd-for-a-user-s-directory-on-ubuntu-20-04
