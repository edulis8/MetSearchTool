
# BuildingConnected Frontend Challenge
## High-level overview of the way I structured the code:
* Used React functional components and hooks.
    * A Container component with the search input, also displaying the number of rendered results in real time.
    * Up to 20 Card components to display each art object from the API.
* A call is made to query the user's search input from the MET API, which retrieves a list of art object ids.
* Due to the nature of the MET API, these ids must be looped over and a separate call is made to retreive each art object's data
* The search input is debounced such that a call will be made every 400ms as the user is typing.
* Per [this](https://sebastienlorber.com/handling-api-request-race-conditions-in-react) Medium post, API request race conditions are handled:
    * Only handle the responses from the last issued request: if user enters several search terms in quick succession, only loop over the object IDs from the last search term to fetch the individual art objects.
    * Cancel/abort former API calls that will not be used.

## Thoughts around things I might change if I was going to take the time to turn this into an actual product:
* Add image spinner while user waits for search results.
* Resolve bug where if user changes a valid searchterm to an invalid one quickly, the valid cards will stay rendered. 
* Load test simulating network delays and failures while user changes search input.



This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).




