# SH40 Main Ferguson Bequest

## Description
This project was part of the Level 3 Team Project course to develop a piece of software for use by the customer. 
Ferguson Bequest is a system that brings together available attractions, ticket draws and booking information in one place. It exists to help University of Glasgow staff access and enjoy various activities. 
The aim of this project was to redesign the website for better usability and ease of use for administrators.

### Features
- Simple, modern interface
- Attraction booking
- Ticket draw entering
- Booking history
- Announcements
- Reviews for attractions

### Additional Features for Admins
- Add and delete attractions and ticket draws
- Pick a winner from a ticket draw
- Edit attractions/ticket draws
- Post and delete announcements


## Requirements
You must have Docker installed on your desktop. Go to [Docker](https://www.docker.com/) and click on Download Docker Desktop. Choose the download for your operating system.

To inspect the code, you must have an Integrated Development Environment (IDE). We would suggest using Visual Studio Code which can be downloaded [here](https://code.visualstudio.com/).

## Installation
- Clone this project
  ```git clone https://github.com/DannySommar/glasgow-university-ferguson-bequest.git```
- Open the project in the terminal


## Viewing the website on the University network
Visit ```http://maloelap.dcs.gla.ac.uk:5000/```  when connected to the University network or using the University VPN.

## Usage
Description of files in the project:
Frontend:
This is what the user can see, click, interact with. It is what gets displayed on the web page.
- Tests - Tests for some elements/components
- Pages - Contains each web page and associate style sheet
- Images - All images used in the web pages. More get added when creating a new attraction or ticket draw
- Components - Reusable elements used in the application such as the footer and navigation bar

Backend:
This is what the user cannot see. It includes the "behind-the-scenes" parts such as the database that stores things such as the information of attractions and logins. 
- Database - Data, tables and relationships between them
- Tests - Tests for some elements such as login or reviews
- Uploads - Images used in the website
- Controllers - Functions used for requests from the website
- Routes - Maps given request to the correct controller
- Data
- Middleware 

To run tests:
- Open the folder of this project in terminal
- Run ```npm run test``` in the terminal and press enter
- The status of the test run should be displayed: which tests and tests files passed/failed


## Support
If you need help, please contact one of the authors of this project:
- **Danny Shevchuk 2913985S@student.gla.ac.uk**
- **Lewis Gray 2887454G@student.gla.ac.uk**
- **Diana Polese-Abramowicz 2881748P@student.gla.ac.uk**
- **Hammaad Uddin 2787006U@student.gla.ac.uk**
- **Andrea Alexander 2892128A@student.gla.ac.uk**


## Authors and acknowledgment
- Andrea Alexander
- Danny Shevchuk
- Diana Polese-Abramowicz
- Hammaad Uddin
- Lewis Gray

We want to thank the Ferguson Bequest team and the University of Glasgow for allowing us to partake in this project.

## License
This project is licensed under the [MIT License.](https://opensource.org/license/MIT) You can find the project license [here](https://stgit.dcs.gla.ac.uk./team-project-h/2025/sh40/sh40-main/-/blob/main/LICENSE)

## Project status
The development of this project has ceased by the authors of this project. 
