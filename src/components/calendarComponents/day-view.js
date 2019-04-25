import React from 'react';
import { View, ScrollView } from 'react-native';
import { Header,ListItem,Text,Input,Button, Divider, ButtonGroup, Overlay, } from 'react-native-elements';
import MealManager from '../editMealsComponents/meal-manager';
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';



class viewDayScreen extends React.Component {
	
	constructor (props) {
        super(props)
        
		this.MM = null;
		
		this.bArray = [];
		this.lArray = [];
		this.dArray = [];
		
		this.constructMealPlan();
		let currDate = this.props.navigation.state.params.dayChosen;
		this.state = {
			selectedIndex: 0,
			activeList: this.bArray,
			currDate:currDate,
			overlayVisible: false,
			removeText: null
        }
        this.updateIndex = this.updateIndex.bind(this);
		this.overlayBP = this.overlayBP.bind(this);
		this.overlayItem = null;
		
		this.isLoading = true;
    }
	
	async constructMealPlan() {
		
		let mm = new MealManager();
		
		await mm.init();
		
		this.MM = mm;
		
		//console.log('mealplancalendar object: ' + JSON.stringify(mm));
		
		let mp = mm.getMealPlan(this.state.currDate);
		
		console.log('mealplan object: ' + JSON.stringify(mp));
		
		let Bstr = '', Lstr = '', Dstr = '';
		
		if(mp != undefined) {
			
			this.bArray = mp.Breakfast;
			this.lArray = mp.Lunch;
			this.dArray = mp.Dinner;	
		}
		
		this.setState({isLoading : false ,activeList:this.bArray});
	}
	
	updateMealPlan() {
		
		let mp = this.MM.getMealPlan(this.state.currDate);
		
		let Bstr = '', Lstr = '', Dstr = '';
		
		if(mp != undefined) {
			
			this.bArray = mp.Breakfast;
			this.lArray = mp.Lunch;
			this.dArray = mp.Dinner;	
		}	
	}
    
    updateIndex (selectedIndex) {
        this.setState({selectedIndex});
		if(selectedIndex == 0)
			this.setState({activeList:this.bArray});
		if(selectedIndex == 1)
			this.setState({activeList:this.lArray});
		if(selectedIndex == 2)
			this.setState({activeList:this.dArray});
    }

  render() {
    const buttons = ['Breakfast', 'Lunch', 'Dinner'];
	const overlayButtons = ['Yes', 'No'];
    const { selectedIndex } = this.state;
		let dayChosen=new Date(this.state.currDate);
		dayChosen.setDate(dayChosen.getDate()+1);
		dayChosen=dayChosen.toDateString().split(' ').slice(1).join(' ');
    
    currIndex = selectedIndex;
	
	
		if(this.state.isLoading){
			return (<View></View>) ;
		}
	
	//<></> Prevents comments from working it seems...
	//Empty angle brackets in overlay prevents warning of multiple Components being passed to Overlay
	//TODO: Overlay remove onBackdropPress and disable buttons when yes is pressed, to prevent additional button presses during removal
	
      return (

        <View style={{backgroundColor:'#d0d0d0',flex:1}} >

            <Text h1 style={{backgroundColor:'#0b486b',color:'#FFFFFF',padding: Platform.OS === 'ios' ? '5% 0 5% 5%' : '5%'}}>{dayChosen}</Text>
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
            <ButtonGroup
                onPress={this.updateIndex}
                selectedIndex={selectedIndex}
                buttons={buttons}
                containerStyle={{height: '10%'}}
            />
			<ScrollView style={{height:'40%'}}>
				{
					this.state.activeList.map( (name) => (
					<ListItem
						key={name}
                        title={name}
						topDivider={true}
						bottomDivider={true}
						rightIcon={(
						<Icon 
							name = {Platform.OS === 'ios' ? 'ios-close-circle' : 'md-close-circle'}
							size = {28}
							color = 'red'
							onPress = { this.displayOverlay.bind(this, name) }
						/>
						)}
                    />
					))
				}
			</ScrollView>
			<Button title='Add a meal'
				onPress={() => this.props.navigation.navigate('DayAddMeal', {dayChosen:this.state.currDate, currIndex:currIndex})}
            />
        
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
  export default viewDayScreen;