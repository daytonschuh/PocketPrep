import React from 'react';
import { View, ScrollView  } from 'react-native';
import { Header,ListItem,Divider, ButtonGroup, Button } from 'react-native-elements';
import recipeData from '../../data/recipe';
import { FileSystem } from 'expo';

class MealScreen extends React.Component {
    constructor(props){
        super(props);

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
              console.log(currentCustomMeals);
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
            selectedIndex:0,
            overlayVisible: false,
            removeText: null
        }
        this.overlayBP = this.overlayBP.bind(this);
		    this.overlayItem = null;
        this.updateIndex = this.updateIndex.bind(this);
    

    }
    updateIndex (selectedIndex) {
        console.log(this.state.customMeals);
        this.setState({selectedIndex});
        if(selectedIndex == 0)
          this.setState({displayList:this.state.presetMeals});
        else
          this.setState({displayList:this.state.customMeals});
    }
    render() {
        const buttons = ['Preset', 'Custom'];
        const overlayButtons = ['Yes', 'No'];
        const {selectedIndex} = this.state;

      return (
        <View style={{flex:1}}>
            <ButtonGroup
                onPress={this.updateIndex}
                selectedIndex={selectedIndex}
                buttons={buttons}
                containerStyle={{height: '10%'}}
            />
            <Overlay 
                isVisible={this.state.overlayVisible}
                onBackdropPress={ this.hideOverlay.bind(this) }
                height={'auto'}
              >
                <>
                  <Text>Delete "{this.overlayItem}"?</Text>
                  <ButtonGroup 
                    onPress={this.overlayBP}
                    buttons={overlayButtons}
                    containerStyle={{top:16}}
                  />
                  <Text>{this.state.removeText}</Text>
                </>
            </Overlay>
        
            <ScrollView style={{height:'85%'}} >
                {
                    this.state.displayList.map((l,i) => (
                    <ListItem
                        key={i}
                        title={l.name}
                        topDivider={true}
                        bottomDivider={true}
                        rightIcon={this.handleViewIcon()}
                        // onPress={this.handleMealSend.bind(this,l.name)}
                    />
                    ))
                }
            </ScrollView>
            {this.handleViewAddButton()}
        </View>
      );
    }
    displayOverlay(name){
      this.overlayItem = name;
      this.setState({overlayVisible:true});
    }
    
    hideOverlay(){
      this.overlayItem = null;
      this.setState({overlayVisible:false, removeText:null});
    }
    handleViewIcon(){
      if(this.state.selectedIndex == 1){
          return(
            <Icon 
              name = {Platform.OS === 'ios' ? 'ios-close-circle' : 'md-close-circle'}
              size = {28}
              color = 'red'
              onPress = { this.displayOverlay.bind(this, name) }
            />
          );
      }
      else{
        return;
      }
    }
    handleViewAddButton(){
        if(this.state.selectedIndex == 1){
            return(
                <Button 
                    title="Add a new Meal"
                    onPress={()=>this.props.navigation.navigate('AddRecipe')}
                />
            );
        }
        else{
            return;
        }
    }
    handleMealSend(name){
        const { navigate } = this.props.navigation;
        // Send name of the meal to the Ingredients Screen Component (ingredients.js)
        navigate('Ingredients', { mealName: name })

        return;
    }
    async overlayBP(selectedIndex){
      if(selectedIndex == 0){
        //set state for state saying its being removed
        this.setState({removeText:'Removing...'});
        //await removal
        await this.MM.removeMeal(this.state.currDate, this.state.selectedIndex, this.overlayItem);
        //set state for meal plan or something similar
        this.updateMealPlan();
        //hide overlay
        this.hideOverlay();
      }
      if(selectedIndex == 1)
        this.hideOverlay();
      
    }


  }
  export default MealScreen;