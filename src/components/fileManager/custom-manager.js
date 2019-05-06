import { FileSystem } from 'expo';

export default class MealManager {
	
	constructor(){
	
		//Get/create filepath
		this.fileUri = FileSystem.documentDirectory + 'custom.json';
		this.customMeals = null;
	}
	
	//MUST CALL AFTER CREATING MEALMANAGER OBJECT
	//The point is to call this function using await, since the constructor is not async you cannot await it.
	//Therefore you create the object and then call its init() function
	async init() {
		
		let fileInfo = await FileSystem.getInfoAsync(this.fileUri);
		
		if ( fileInfo["exists"] == true ) {
			
			let result = null;
			
			try {
				//Wait for FileSystem read to return a result string
				result = await FileSystem.readAsStringAsync(this.fileUri);
			
			} catch(e) {
				console.log(e);
			}
			//Parse result to object and store in MealPlanCalendar
			this.customMeals = JSON.parse(result);
		}
		else {
			console.log('custom file does not exist');
			//create the file based on app's asset
			FileSystem.writeAsStringAsync(this.fileUri, JSON.stringify([]));
		}

	}
	
	
	//get mealplan object from MealPlanCalendar
	//Parameter: date associated with mealplan
	getCustomMeal(d){	
		
		return this.customMeals[d];
	}
	
	//getMealPlanString(d,t){}


	
	async removeMeal(mealName) {
		
		if(this.customMeals[mealName] == null || this.customMeals[mealName] == undefined )
			return false;
		else {
			delete customMeals[mealName];

			//Writes Object/Data_structure to file
			await FileSystem.writeAsStringAsync(this.fileUri, JSON.stringify(this.customMeals));
			
			
			
			//Output for debug/testing purposes
			console.log("removed " + mealName);
			
			//Remove Successful
			return true;
		}
	}
	
	//Testing Purposes
	printFile() {
		FileSystem.readAsStringAsync(this.fileUri).then( (filedata) => {console.log(filedata)});
	}
}
