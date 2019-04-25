import React from 'react';
import { View, ScrollView  } from 'react-native';
import { Header,ListItem,Divider, ButtonGroup, Input } from 'react-native-elements';
import recipeData from '../../data/recipe';
import MealManager from '../editMealsComponents/meal-manager';
import { FileSystem } from 'expo';

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
            //    console.log(currentCustomMeals);
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
	

    // essentially copy paste of preset.js
    // handle is slightly different
    render() {
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
            <Input  placeholder="Search" 
                    containerStyle={{padding:'2%'}}
                    leftIcon={{ type: 'font-awesome', name: 'search' ,color:'#808080' }}
                    leftIconContainerStyle={{paddingRight:'5%'}}
                    
                    />

            <ScrollView style={{height:'80%'}} >
                {
                    this.state.displayList.map((l,i) => (
                    <ListItem
                        key={`${i}`+l.name}
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
        this.props.navigation.navigate('Calendar');
    }

  }
  export default viewDayAddMeal;