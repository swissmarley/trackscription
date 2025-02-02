# <p align="center">📇 Trackscription 📇 </p>

A full-stack web application designed to help you efficiently manage and monitor your subscriptions. Built with Node.js + Express on the backend and React + Tailwind CSS on the frontend, TrackScription offers a user-friendly interface to keep track of all your recurring expenses in one place.

## Features

 •	Add, edit, and delete your subscriptions with ease.
	
 •	Organize subscriptions by categories for better clarity.
	
 •	Expense Tracking
	
 •	Monitor your spending on various services.
	
 •	View detailed information about each subscription, including cost, renewal dates, and service provider.
	
 •	Notifications
	
 •	Receive alerts for upcoming payments or subscription renewals.
	
 •	Stay informed about trial periods ending soon.
	
 •	Analytics
	
 •	Visualize your spending patterns over time.
	
 •	Generate reports to understand your subscription habits.


## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/swissmarley/trackscription.git
   cd trackscription
   ```

2.	**Install Modules**

    ```bash
    npm install
    ```

3. **Setup Database**

   Create .env file in root project folder:
   ```bash
   #.env
   DATABASE_URL=postgresql://username:password@localhost:5432/dbname
   ```

   Initizalize schema with database: 
   ```bash
   npm run db:push
   ```

5. **Run App**
   ```bash
   npm run dev
   ```
    
    •	Starts the React app on http://localhost:5004.


## Usage

1.	Add a Subscription:
   
	•	Navigate to the “Add Subscription” section.

	•	Fill in the details such as service name, cost, renewal date, and category.

	•	Click “Add” to save the subscription.

2.	View Subscriptions:
    
	•	Go to the “Subscriptions” page to see a list of all your subscriptions.

	•	Use filters to sort by category, renewal date, or cost.

3.	Edit or Delete a Subscription
    
	•	In the “Subscriptions” list, select the subscription you want to modify.

	•	Click “Edit” to update details or “Delete” to remove it.

4.	Dashboard
    
	•	Access the “Dashboard” to view analytics and reports.

	•	Gain insights into your spending patterns and upcoming renewals.



## Contributing

Feel free to open issues or pull requests. Contributions are welcome!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
