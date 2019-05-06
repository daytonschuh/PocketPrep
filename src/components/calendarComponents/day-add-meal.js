import React from 'react';
import { View, ScrollView  } from 'react-native';
import { Header,ListItem,Divider, ButtonGroup } from 'react-native-elements';
import recipeData from '../../data/recipe';
import MealManager from '../fileManager/meal-manager';
import { FileSystem } from 'expo';
import { StackActions,NavigationActions} from 'react-navigation'

class viewDayAddMeal extends React.Component {

    constructor (props){
        super(props)
        this.MM = null;
        this.constructMealPlan();

        let currentCustomMeals=[];
        this.fileUri = FileSystem.documentDirectory + 'custom.json';
        //FileSystem reads are asynchronous, must await before creating MealPlanCalendar object
        FileSystem.getInfoAsync(this.fileUri).then((fileInfo) =>{

          if ( fileInfo["exists"] == true) {
            console.log('custom file exists');
            
            //FileSystem reads are asynchronous, must await before creating MealPlanCalendar object
            fileread = async () => {
              let result = null;
            
              try {
                //Wait for FileSystem read to return a result string
                result = await FileSystem.readAsStringAsync(this.fileUri);
              
              } catch(e) {
              console.log(e);
              }
              //Parse result to object and store in MealPlanCalendar
              currentCustomMeals = JSON.parse(result);
              this.setState({customMeals:currentCustomMeals});
            }
            //Run async function
            fileread();
            }
            else {
              console.log('custom file does not exist');
              //create the file based on app's asset
              currentCustomMeals = "[]";
              FileSystem.writeAsStringAsync(this.fileUri, currentCustomMeals);
              currentCustomMeals = [];
            }


        });
        this.state={
            customMeals:currentCustomMeals,
            presetMeals:recipeData,
            displayList:recipeData,
            selectedIndex:0
        }

        this.updateIndex = this.updateIndex.bind(this);
    

    }
    updateIndex (selectedIndex) {
        this.setState({selectedIndex});
        if(selectedIndex == 0)
          this.setState({displayList:this.state.presetMeals});
        else
          this.setState({displayList:this.state.customMeals});
    }

    async constructMealPlan() {

		let mm = new MealManager();

        await mm.init();
        
        this.MM = mm;

	}
	
	/* addmealButtonPress(d,t,m) {
		this.MM.addmeal(d,t,m);
		this.props.navigation.navigate('DayView', dayChosen );
	} */

    // essentially copy pasta of preset.js
    // handle is slightly different
    render() {
        console.log(this.state.props);
        const buttons = ['Preset', 'Custom'];
        const {selectedIndex} = this.state;
        let currIndex = selectedIndex;
        let dayChosen=this.props.navigation.state.params.dayChosen;
      return (

        <View style={{flex:1}}>
            <ButtonGroup
                onPress={this.updateIndex}
                selectedIndex={selectedIndex}
                buttons={buttons}
                containerStyle={{height: '10%'}}
            />
        
            <ScrollView style={{height:'85%'}} >
                {
                    this.state.displayList.map((l) => (
                    <ListItem
                        key={l.name}
                        title={l.name}
                        topDivider={true}
                        bottomDivider={true}
                        onPress={this.handleAddMeal.bind(this,this.props.navigation.state.params.dayChosen,this.props.navigation.state.params.currIndex ,l.name)}
                    />
                    ))
                }
            </ScrollView>
        </View>
      );
    }
	
    handleAddMeal(dayChosen,currIndex,name){
        this.MM.addmeal(dayChosen,currIndex,name);
		
		// Reset Stack, navigates to Calendar/Main, then to DayView, this preserves the back button
        const resetAction = StackActions.reset({
			index: 1,
			actions: [NavigationActions.navigate({ routeName: 'Main' }), NavigationActions.navigate({ routeName: 'DayView', params:{ dayChosen:dayChosen, currIndex:currIndex } }) ],
		});
		this.props.navigation.dispatch(resetAction);
    }

  }
  export default viewDayAddMeal;