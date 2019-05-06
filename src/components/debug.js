import React from 'react';
import { View, ScrollView } from 'react-native';
import { Header,Text,ListItem,CheckBox,Button } from 'react-native-elements';
import { FileSystem } from 'expo';



class DebugScreen extends React.Component {
	constructor(props){
      super(props);
      
      
    }

    render() {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
					<ScrollView style={{height:'40%'}}>
						{

							<ListItem
								key={0}
								title={"Configure Days"}
								topDivider={true}
								bottomDivider={true}
							/>

						}
					</ScrollView>
				</View>
      );
    }
  }
export default DebugScreen;