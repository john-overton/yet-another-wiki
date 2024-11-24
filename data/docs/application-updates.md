# Application Updates

This guide will walk you through the process of safely updating your Yet Another Wiki installation to a new version.

## Before Updating

Before proceeding with any update, it's crucial to create a backup of your current installation:

1. Navigate to the Settings page
2. In the Backup & Import section, click the "Create Backup" button
3. Save the downloaded backup file (.zip) in a secure location
4. Verify that the backup file was downloaded successfully

## Update Methods

There are two ways to update your installation:

### Method 1: Replace Existing Installation

1. Create a backup as described above
2. Download the new version of Yet Another Wiki
3. Stop the current application
4. Replace the existing application files with the new version
5. Start the application
6. You will be redirected to the setup wizard
7. Follow the setup process
8. When prompted, use the "Import Backup" option to restore your data from the backup file

### Method 2: Fresh Container Deployment

If you're using Docker:

1. Create a backup as described above
2. Pull the new version of the container:```
   docker pull yetanotherwiki/yaw:latest
   ```
3. Stop and remove the existing container
4. Deploy the new container
5. You will be redirected to the setup wizard
6. Follow the setup process
7. When prompted, use the "Import Backup" option to restore your data from the backup file

## Restoring Your Backup

During the setup process:

1. When you reach the backup import step, click "Import Backup"
2. Select your backup file (.zip) that you created earlier
3. Confirm the import
4. Wait for the restore process to complete
5. The application will automatically reload with your restored content

## Important Notes

* Never proceed with an update without first creating and verifying a backup
* The backup includes all your data, database, public files, and configuration
* During the restore process, all existing content will be replaced with the content from your backup
* Make sure you have enough disk space for both the update and your backup
* Keep your backup file secure and accessible until you've verified the update was successful