# DirectExchange - A currency remittance and exchange system 

## Project Overview and Architecture Diagram

- This is a **digital remittance service** that helps you **send money abroad.**
- DirectExchange foreign currency exchange provides users with an **online platform where they can exchange currencies with one another.**
- This service essentially **cuts out the middleman—banks, foreign exchange (forex) services, and other institutions**—by allowing users to make trades between themselves. Since there are no dealers involved, users may **get a better rate** on their exchange.

<img width="1018" alt="Screen Shot 2021-01-31 at 3 58 53 PM" src="https://user-images.githubusercontent.com/52833369/106402185-3a2ecd00-63dd-11eb-86dc-c7a9676562e5.png">

### What's so special about DirectExchange:
It essentially cuts out the middleman—banks, foreign exchange (forex) services, and other institutions — by allowing users to make trades between themselves. Since there are no dealers involved, users may get a better rate on their exchange.

### Main features of DirectExchange:
- FireBase authentication was used in order to give users the flexibility to sign in with google or then can also authenticate themselves with email and password as well. 
- Users can directly accepting any offer or posting a counter offer directly without creating an offer from the user itself. 
- Also, users can browse split offers or the offers in range of his/her offer and can directly accept the same. 
- Apart from that time-limit has been set to accept the offer and complete the transaction so as to avoid delay in serving any request.

### How to use it:
Using this application is simple. Users register with a Direct Exchange currency exchange service for an online account to make deposits. Depending on the prevailing rates, users can accept a given exchange rate or bid on an exchange rate of their choosing. The application then makes a match, shows a change in the ownership of funds, and remits them once all parties complete the transaction through a simple domestic transfer. No currency ever leaves the country but is merely exchanged between users. Users can send money to any person even to their own account in another country.

Exchanges are particularly convenient for common currencies like USD, GBP, EUR, RMB, and INR where there are always many people looking to exchange. Because the platforms depend on connecting individual users in different countries, users of smaller currencies may not immediately find a good corresponding match.

## Functionalities: 
- Prevailing rates:
![image](https://user-images.githubusercontent.com/52833369/106413610-61969180-63ff-11eb-8a8c-680485274418.png)

- Adding bank accounts:
<img width="883" alt="Screen Shot 2021-01-31 at 8 05 16 PM" src="https://user-images.githubusercontent.com/52833369/106413710-a6bac380-63ff-11eb-88f9-d4e09d61d721.png">

- Posting an offer:
<img width="873" alt="Screen Shot 2021-01-31 at 8 06 20 PM" src="https://user-images.githubusercontent.com/52833369/106413771-cbaf3680-63ff-11eb-98e4-7aaecd65be93.png">

- My offers page with counter offers if someone has made it:
<img width="873" alt="Screen Shot 2021-01-31 at 8 13 31 PM" src="https://user-images.githubusercontent.com/52833369/106414159-cbfc0180-6400-11eb-8106-ca1c6829fce5.png">

- Browse offer page from which multiple actions can be taken: 
<img width="889" alt="Screen Shot 2021-01-31 at 8 09 24 PM" src="https://user-images.githubusercontent.com/52833369/106413948-39f3f900-6400-11eb-84ce-fe6d6fbac967.png">

- Filter offers by Source and Destination currency and currency amount: 
<img width="883" alt="Screen Shot 2021-01-31 at 8 10 09 PM" src="https://user-images.githubusercontent.com/52833369/106413976-542dd700-6400-11eb-91e8-e78408e5d937.png">

- Sending message to another offer maker: 
<img width="883" alt="Screen Shot 2021-01-31 at 8 12 29 PM" src="https://user-images.githubusercontent.com/52833369/106414101-a8d15200-6400-11eb-9d74-bb39891200b2.png">

## Getting Started
### Prerequisites:
1. On your local device you need to have java, NodeJS and NPM(Node Package Manager) installed to succesfully run this project.

### Steps to start the application:
1. Clone the repository from the master branch.
2. Setup a MySQL server somewhere either localy or like we did in AWS RDS.
3. Go to [backend/src/main/resources/application.properties](backend/src/main/resources/application.properties).
    1. Change spring datasource url, username and password to your own values of MySQL server.
    ```
    spring.datasource.url=jdbc:mysql://localhost:3306/DirectExchange?suseUnicode=true&useJDBCCompliantTimezoneShift=true&useLegacyDatetimeCode=false&serverTimezone=UT
    spring.datasource.username=root
    spring.datasource.password=admin123
    ```
4. Go to [frontend](frontend).
    1. run 
    ```
    npm install
    ```
    2. Create a .env file with the following content.
    ```
    REACT_APP_BACKEND_URL= http://localhost:8080
    ```
5. Run the backend server by running [DirectExchange/DirectExchangeApplication.java](backend/src/main/java/edu/sjsu/cmpe275/DirectExchange/DirectExchangeApplication.java)file.
6. To run the frontend server go to [frontend](frontend) and run
```
npm start
```

## Authors

* **Aayush Sukhadia**
* **Deepen Patel**
* **Harshil Shah**
* **Narain**
