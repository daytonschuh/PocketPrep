import React from 'react';
import moment from 'moment';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import MealManager from '../fileManager/meal-manager';
import { StackActions,NavigationActions} from 'react-navigation';
import {FileSystem} from 'expo';




const _format = 'YYYY-MM-DD'
const _today = moment().add(0,'days').format(_format)
const _maxDate = moment().add(60, 'days').format(_format)

class CalendarScreen extends React.Component {
  // It is not possible to select some to current day.
  initialState = {
      [_today]: {disabled: false}
  }

  constructor(props) {
    super(props);
    this.MealManage = null;
    this.state = {
      _markedDates: this.initialState
    }
    this.constructMealPlan();
	}

	async constructMealPlan() {

		console.log("Navigated to Calendar");
	
		let mm = new MealManager();

		await mm.init();
		
		this.MealManage = mm;

	}
  
  // Could use this to navigate to a new page
  // probably something like: navigation.navigate('MealList', {day.dateString})
  // if food is found in the MealList, mark the date
  onDaySelect = (day) => {
      const _selectedDay = moment(day.dateString).format(_format);

      this.props.navigation.navigate('DayView',{
        dayChosen: _selectedDay
      });

  }
  
  render() {
	this.constructMealPlan();
    return (
      <View style={{flex: 1}}>
        <CalendarList
            theme={{monthTextColor: 'blue'}}
            
            pastScrollRange={0}
            futureScrollRange={1}

            // we use moment.js to give the minimum and maximum dates.
            minDate={_today}
            maxDate={_maxDate}

            // hideArrows={true}

            onDayPress={this.onDaySelect}
            markedDates={this.state._markedDates}

            //Would like to get this working with: markingType={'period'}, but currently only implemented for default marking
        />
        <TouchableOpacity
          style={styles.primarybutton}
          onPress ={this.handleSend.bind(this)}
        >
        <Text style = {{color: '#FFFFFF'}}> Compile Shopping List </Text>
        </TouchableOpacity>
      </View>
    );
  }
  async grabSettings(){
    this.fileUri = FileSystem.documentDirectory + 'settings.json';
    //FileSystem retrieves file information (exists), must await before accessing file
    FileSystem.getInfoAsync(this.fileUri).then((fileInfo) =>{

      if ( fileInfo["exists"] == true) {
        
        //FileSystem reads are asynchronous, must await before creating customMeals List
        fileread = async () => {
          let result = null;
        
          try {
            //Wait for FileSystem read to return a result string
            result = await FileSystem.readAsStringAsync(this.fileUri);
          
          } catch(e) {
          console.log(e);
          }
          //Parse result to object and store in Custom Meals List
          this.settings=JSON.parse(result); 
          console.log(this.settings); 
          
          this.setState({numDays:this.settings['days']});          
        }
        //Run async function
        fileread();
        }
        else {
          console.log('settings file does not exist');

          // Write Empty List 
          this.settings={days:3}
          FileSystem.writeAsStringAsync(this.fileUri, JSON.stringify({days:3}));
          this.setState({numDays:this.settings['days']}); 
        }
    });

}
  async handleSend(){
    await this.grabSettings();
    let dates=[moment(_today.dateString).format(_format)];
    for(let numDay=1;numDay<this.state.numDays;numDay++){
        dates.push(moment().add(numDay, 'days').format(_format));
    }
    // Account for :
    //    - Undefined(Days with no meals set)
    //    - MealPlan({"Breakfast":[],"Lunch":[],"Dinner":[]})
    await this.constructMealPlan();
    let mealNames = [];
    // Extracts each date and collects all meal names
    // Stores an array of all meal names (string[] mealNames)
    dates.map((d) => {
      let plan = this.MealManage.getMealPlan(d);
      if(plan !== undefined){
          mealNames=mealNames.concat(plan["Breakfast"],plan["Lunch"],plan["Dinner"]);
      }
    });
    console.log("mealNames set");


    // send array of mealnames through .createShoppingList

    // navigate to the shopping list


    const navigateAction = NavigationActions.navigate({
      routeName: 'Shopping',
      params:{
        compileNames:mealNames,
        shouldReset:true
      },
    });

    this.props.navigation.dispatch(navigateAction);

    // this.props.navigation.navigate('Shopping',{compileNames:mealNames});
    return;
    
  }
}

const styles = StyleSheet.create({
  primarybutton: {
    alignItems: 'center',
    backgroundColor: '#337ab7',
    padding: 10
  }
})

export default CalendarScreen;