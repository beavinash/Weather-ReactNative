import * as React from 'react';
import { TextInput, View, Text, StyleSheet, FlatList, StatusBar, TouchableHighlight } from 'react-native'
import { LinearGradient } from 'expo'
import Dimensions from 'Dimensions';

const API_KEY = '616f7c6ebf57cf29940a19c2fbf3c76b'
const DEFUALT_ZIPCODE = '94103'


export default class App extends React.Component {
  constructor(props) {
    super(props)
    var navigation = this.props.navigation

    this.state = {
      searchInput: '',
      searchResult: 0,
      error: 'Search for a zipcode...', // to display if search doesnt display results
      item: {}, // search results save / go to
      zipcode: DEFUALT_ZIPCODE,
      days: [],
      hashMap: new Map(),
    }
    
  }

  

  

  getTempRange = (t) => {

    if( t < 11 ){
      return 1
    }
    if( t > 10 && t < 20 ){
      return 2
    }
    if( t >= 20 && t < 30 ){
      return 3
    }
    if( t >= 30 ){
      return 4
    }

  }

  getEmoji = (type) => {

    if( type == 'Clouds'){
      return '☁️';
    }
    if(type == 'Clear'){
      return '☀️';
    }
    if(type == 'Haze'){
      return '⛅️';
    }
    if(type == 'Thunderstorm'){
      return '⛈';
    }
    if(type == 'Rain'){
      return '🌧';
    }
    if(type == 'Snow'){
      return '❄️';
    }
    if(type == 'Mist'){
      return '☁️';
    }


  }

  searchZip = () => {
    this.fetchZipTemp(this.state.searchInput) // setting in render and props constructor... :)
  }

  // http://api.openweathermap.org/data/2.5/forecast?zip=02125&appid=616f7c6ebf57cf29940a19c2fbf3c76b&units=imperial
  // https://samples.openweathermap.org/data/2.5/forecast?zip=94040&appid=b6907d289e10d714a6e88b30761fae22
  fetchZipTemp = (zipcode) => {
    this.setState({
      item: {}, // to reset state when calling this function so that i display empty
      searchResult: 0,
      error: 'Search for a zip...'
    })
    fetch('http://api.openweathermap.org/data/2.5/forecast?zip='+zipcode+'&appid=616f7c6ebf57cf29940a19c2fbf3c76b&units=imperial')
    // alert('http://api.openweathermap.org/data/2.5/forecast?zip='+zipcode+'&appid=616f7c6ebf57cf29940a19c2fbf3c76b&units=imperial')
    .then((response) => response.json())
    .then((data) => {
      
      //console.log(data)
      var res = data.city
      var obj = data // to access all of the variable when in need
      console.log("before");
      let hashMap = new Map();
      let temps = data.list;
      for (let i = 0; i < temps.length; i++) {
        let temp = temps[i];
        let date = temp.dt_txt;
        let temperature = temp.main.temp;
        date = date.split(" ");
        let day = date[0];
        let time = date[1];
        if (!hashMap.has(day)) {
          // hashMap[day] = [temperature];
          hashMap.set(day, [temperature]);
        } else {
          let arr = hashMap.get(day)
          //console.log(arr)
          arr.push(temperature)
          hashMap.set(day, arr);
        }
      }

      for ( let t of hashMap) {
        console.log(t);
      }
        
        
        this.setState({
          
          searchResult: 1,
          hashMap: hashMap
        });
      })
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle='light-content' />
        <Text style={styles.title}> 🌤Weather </Text>


        <View style= {{alignItems: 'center', width: '90%'}}> 
          <Text style= {{textAlign: 'center', lineHeight: 20, padding: 5, fontSize: 16}}> Search for a Zip Code </Text>
          <TextInput
            onChangeText = { (text) => this.setState({searchInput: text})} // it updates the state each time new letter is typed. 
            value = {this.state.searchInput}
            style = {{width: '80%', padding: 15, margin: 5, backgroundColor: 'black', color: 'white'}}
          />
          <TouchableHighlight
          style = {{ backgroundColor: 'grey', padding: 15, borderRadius: 8 }}
          onPress = { () => this.searchZip() }
          >
          <Text style= {{ fontSize: 16, color: 'white'}}> Search... </Text>
          </TouchableHighlight>
          <Text> {this.state.searchResult} </Text>
          
          {Object.entries(this.state.hashMap).map(([key, value]) => (
                    <View>
                      <Text>  { key }</Text>
                    </View>
          ))}
        </View>

      { this.state.searchResult === 1 ? ( 
        
            <TouchableHighlight
              underlayColor = 'white'
              onPress = { () => alert( this.state.item.desc ) }
            
            >
              <LinearGradient
                colors = {['rgba(0, 0, 0, 0.08)', 'rgba(0, 0, 0, 0)']}
                start = {[0, 0.5]}
              >
              <View style={styles.row}>
                <Text style={[
                  (this.getTempRange(this.state.item.temp) == 1) ? styles.cold : styles.temp,
                  (this.getTempRange(this.state.item.temp) == 2) ? styles.medium : styles.temp,
                  (this.getTempRange(this.state.item.temp) == 3) ? styles.hot : styles.temp,
                  (this.getTempRange(this.state.item.temp) == 4) ? styles.vhot : styles.temp,
                  styles.cityTemp]}> {this.getEmoji(this.state.item.type)} { this.state.item.temp }°C</Text>
                <Text style={styles.cityName}>{ this.state.item.name } </Text>
              </View>
              </LinearGradient>
            </TouchableHighlight>
          
        ): (
          <View style= {styles.container}>
            <Text> {this.state.error} </Text> 
          </View>
        )}
        
        
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    justifyContent: 'flex-start', 
    alignItems: 'center', 
    flex: 1
  },
  title: {
    width: '100%', 
    paddingTop: 40, 
    paddingBottom: 15, 
    backgroundColor: 'black', 
    color: 'white', 
    textAlign: 'center', 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginTop: '20'
  },
  // row: {
  //   flex: 1,
  //   width: Dimensions.get('window').width,
  //   paddingVertical: 25,
  //   paddingHorizontal: 15,
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   borderBottomWidth: 1,
  //   borderBottomcolor: 'black'
  // },
  // zipTemp: {
  //   fontSize: 30,
  //   lineHeight: 40,
  //   width: 130,
  //   marginRight: 15,
  //   fontWeight: 'bold',
  //   fontFamily: 'Avenir'
  // }, 
  // zipName: {
  //   fontSize: 20,
  //   lineHeight: 40,
  //   fontFamily: 'Avenir'
  // },
  // cold: {
  //   color: 'light-blue'
  // },
  // medium: {
  //   color: 'orange'
  // },
  // hot: {
  //   color: 'red'
  // },
  // vhot: {
  //   color: 'red'
  // }

})