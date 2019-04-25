import { FileSystem } from 'expo';
import { Asset } from 'expo';

class mealplan {
		
		constructor(mp) {
			this.Breakfast = [];
			this.Lunch = [];
			this.Dinner = [];
			
			if(mp == null)
				return;
			
			if(mp.Breakfast != null && mp.Breakfast != undefined)
				this.Breakfast = mp.Breakfast;
			if(mp.Lunch != null && mp.Lunch != undefined)
				this.Lunch = mp.Lunch;
			if(mp.Dinner != null && mp.Dinner != undefined)
				this.Dinner = mp.Dinner;
		}
		
		
		//TODO: Handle amounts of the same meal name, preventing duplicate entries
		//Add name of meal to appropriate "meal time"
		add(t,m) {
			if (t == 'B')
				this.Breakfast.push(m);
			else if (t == 'L')
				this.Lunch.push(m);
			else if (t == 'D')
				this.Dinner.push(m);
		}
		
		//Remove a meal with a matching name from an appropriate "meal time"
		remove(t,m) {
			//Temp array
			arr = [];
			
			//Copy array based on time of meal 't'
			if (t == 'B')
				arr = this.Breakfast;
			else if (t == 'L')
				arr = this.Lunch;
			else if (t == 'D')
				arr = this.Dinner;
			
			//Search for matching entry
			i = 0;
			while(arr[i] != m && i < arr.length)
				i++;
			
			//Check if loop finished without finding matching entry
			if(arr[i] != m)
				return false;
			
			if(i == 0)
				//if first entry is a match we can shift to remove
				arr.shift();
			else if(i == arr.length-1)
				//if last entry is a match we can pop to remove
				arr.pop();
			else {
				//Slice a left and right array, leaving out the matched entry
				left = arr.slice(0, i);
				right = arr.slice(i+1, arr.length);
				//Concat into new array
				arr = left.concat(right);
			}
			
			//Copy new array into original previously copied.
			if (t == 'B')
				this.Breakfast = arr;
			else if (t == 'L')
				this.Lunch = arr;
			else if (t == 'D')
				this.Dinner = arr;
			
			//Found and removed entry, return true
			return true;
		}
}

export default class MealManager {
	
	constructor(){
	
		//Get/create filepath
		this.fileUri = FileSystem.documentDirectory + 'mealplan.json';
		this.MealPlanCalendar = null;
	}
	
	//MUST CALL AFTER CREATING MEALMANAGER OBJECT
	//The point is to call this function using await, since the constructor is not async you cannot await it.
	//Therefore you create the object and then call its init() function
	async init() {
		
		let fileInfo = await FileSystem.getInfoAsync(this.fileUri);
		
		if ( fileInfo["exists"] == true ) {
			console.log('mealplan file exists');
			
			let result = null;
			
			try {
				//Wait for FileSystem read to return a result string
				result = await FileSystem.readAsStringAsync(this.fileUri);
			
			} catch(e) {
				console.log(e);
			}
			//Parse result to object and store in MealPlanCalendar
			this.MealPlanCalendar = JSON.parse(result);
			console.log(result);
		}
		else {
			console.log('mealplan file does not exist');
			//create the file based on app's asset
			this.MealPlanCalendar = require('../../data/meal-plan'); 
			FileSystem.writeAsStringAsync(this.fileUri, JSON.stringify(this.MealPlanCalendar));
			FileSystem.readAsStringAsync(this.fileUri).then( (filedata) => {console.log(filedata)});
		}

	}
	
	//Probably don't need this anymore
	static async asyncConstructor() {
		let MM = new MealManager();
		return MM;
	}
	
	//get mealplan object from MealPlanCalendar
	//Parameter: date associated with mealplan
	getMealPlan(d){	
		
		return this.MealPlanCalendar[d];
	}
	
	//getMealPlanString(d,t){}


	//add/append mealplan within MealPlanCalendar
	//Parameters: d = date (XX-XX-XXXX), t = time of meal ('B' 'L' or 'D'), m = name of meal/recipe
	addmeal(d, t, m) {
	
		//if there is not an existing mealplan
		if( this.MealPlanCalendar[d] == null || this.MealPlanCalendar[d] == undefined ) {
			
			//Create mealplan object
			let mp = new mealplan(null);
			
			//Add to meal plan according to Breakfast, Lunch, or Dinner
			mp = this.arrayAdd(mp,t,m);
			
			//append mealplan to MealPlanCalendar
			this.MealPlanCalendar[d] = mp;
		}
		else {

			//Retrieve mealplan from calendar
			mp = this.MealPlanCalendar[d];
			
			console.log('mp old: ' + JSON.stringify(mp));
			
			//add the meal to mealplan object
			mp = this.arrayAdd(mp,t,m);
			
			//append meal in MealPlanCalendar
			this.MealPlanCalendar[d] = mp;
		}
		
		//Writes Object/Data_structure to file
		FileSystem.writeAsStringAsync(this.fileUri, JSON.stringify(this.MealPlanCalendar));
		
		//Output for debug/testing purposes
		console.log("added " + m);
		
		return;
	}
	
	async removeMeal(d,t,m) {
		
		if(this.MealPlanCalendar[d] == null || this.MealPlanCalendar[d] == undefined )
			return false;
		else {
			//Retrieve mealplan from calendar
			mp = this.MealPlanCalendar[d];
			
			//add the meal to mealplan object
			let result = this.arrayRemove(mp,t,m);
			
			// If a matching meal wasn't found, cannot remove anything return false/result
			if(!result)
				return result;
			
			//append meal in MealPlanCalendar
			this.MealPlanCalendar[d] = mp;
			
			//Writes Object/Data_structure to file
			await FileSystem.writeAsStringAsync(this.fileUri, JSON.stringify(this.MealPlanCalendar));
			
			
			
			//Output for debug/testing purposes
			console.log("removed " + m);
			
			//Remove Successful
			return result;
		}
	}
	
	//Replacement for mp.add, may fix later and continue using mp.add if successfully typecasted
	arrayAdd(mp,t,m) {
		if (t == 'B' || t == 0)
			mp.Breakfast.push(m);
		else if (t == 'L' || t == 1)
			mp.Lunch.push(m);
		else if (t == 'D' || t == 2)
			mp.Dinner.push(m);
		
		console.log('mp new: ' + JSON.stringify(mp));
		return mp;
	}
	
	arrayRemove(mp,t,m) {
		//Temp array
		arr = [];
		
		//Copy array based on time of meal 't'
		if (t == 'B' || t == 0)
			arr = mp.Breakfast;
		else if (t == 'L' || t == 1)
			arr = mp.Lunch;
		else if (t == 'D' || t == 2)
			arr = mp.Dinner;
		
		//Search for matching entry
		i = 0;
		while(arr[i] != m && i < arr.length)
			i++;
		
		//Check if loop finished without finding matching entry
		if(arr[i] != m)
			return false;
		
		if(i == 0)
			//if first entry is a match we can shift to remove
			arr.shift();
		else if(i == arr.length-1)
			//if last entry is a match we can pop to remove
			arr.pop();
		else {
			//Slice a left and right array, leaving out the matched entry
			left = arr.slice(0, i);
			right = arr.slice(i+1, arr.length);
			//Concat into new array
			arr = left.concat(right);
		}
		
		//Copy new array into original previously copied.
		if (t == 'B' || t == 0)
			mp.Breakfast = arr;
		else if (t == 'L' || t == 1)
			mp.Lunch = arr;
		else if (t == 'D' || t == 2)
			mp.Dinner = arr;
		
		return true;
	}
	
	//Testing Purposes
	printFile() {
		FileSystem.readAsStringAsync(this.fileUri).then( (filedata) => {console.log(filedata)});
	}
}
