Run code using npm start

A feature-rich e-commerce platform using the MERN stack. Key features include user authentication, product listing, image uploads, location-based search, a real-time chat system and a responsive design. 
Utilized Lea?et.js for interactive location maps without API keys. Designed with a focus on scalability, user experience, and modern web development practices.

Algorithm Details

Nearby Search Algorithm Using Geolocation
To implement a feature that allows users to discover products or services listed within a specified radius from their current location using geolocation data.
Steps Involved:
1. Retrieve User's Current Location:
   - The `navigator.geolocation.getCurrentPosition` API is used to obtain the user's current latitude and longitude.
   - In case of errors, appropriate fallback mechanisms or alerts will notify the user.
2. Dataset Preparation:
   - The dataset consists of product listings or service locations, each tagged with geographic coordinates (latitude and longitude).
   - All records in the dataset are indexed to optimize distance calculations.
3. Distance Calculation:
   - The Haversine Formula is used to compute the distance between two geographic points (user’s location and product location) based on their latitudes and longitudes. 
       Formula:
            d=2⋅R⋅arctan2(√a ,√(1-a) )
4. Filter Results by Radius:
   - For each product or service in the dataset, compute the distance from the user’s current location.
   - Include only those items where the computed distance is within the specified search radius.
5. Sort and Display Results:
   - Optionally, sort the results based on proximity to enhance user experience.
   - Present the final filtered dataset to the user.
