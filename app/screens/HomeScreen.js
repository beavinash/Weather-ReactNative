import * as React from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar, TouchableHighlight } from 'react-native'
import { LinearGradient } from 'expo'
import Dimensions from 'Dimensions';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    var navigation = this.props.navigation

    this.state = {
      cities: [ // array
          { name: "London",
            country: "UK"
          },
          { name: "Edinburgh",
            country: "UK"
          },
          { name: "New York",
            country: "US"
          },
          { name: "Texas",
            country: "US"
          },
          { name: "Washington",
            country: "US"
          },
          { name: "Paris",
            country: "France"
          },
          { name: "Doha",
            country: "Qatar"
          },
          { name: "Sydney",
            country: "Australia"
          },
          { name: "Cancun",
            country: "Mexico"
          },
          { name: "Madrid",
            country: "Spain"
          },
          { name: "Berlin",
            country: "Germany"
          },
          { name: "Brussels",
            country: "Belgium"
          },
          { name: "Copenhagen",
            country: "Denmark"
          },
          { name: "Athens",
            country: "Greece"
          },
          { name: "New Delhi",
            country: "India"
          },
          { name: "Dublin",
            country: "Ireland"
          },
          { name: "Rome",
            country: "Italy"
          },
          { name: "Tokyo",
            country: "Japan"
          },
          { name: "Wellington",
            country: "New Zealand"
          },
          { name: "Amsterdam",
            country: "Netherlands"
          },
          { name: "Oslo",
            country: "Norway"
          },
          { name: "Panama City",
            country: "Panama"
          },
          { name: "Lisbon",
            country: "Portugal"
          },
          { name: "Warsaw",
            country: "Poland"
          },
          { name: "Moscow",
            country: "Russia"
          }
        ],

        list: [], // another array for json values. this is used to store results rather than just displayign on terminal
        refresh: true, // refresh data each time app opens
        newAlert: 0

    }
    // this.fetchCityTemp('London', 'UK')
    // var list = this.getRandom(this.state.cities, 5)
    // console.log(list)
    this.fetchTemps()
  }

  fetchTemps = () => {
    var newList = []
    var list = this.getRandom(this.state.cities, 7)
    for ( let city in list ) {
      var name = list[city].name
      var country = list[city].country
      this.fetchCityTemp(name, country, newList)
    }
  }

  getRandom = (arr, n) => {
    var result = new Array(n),
      len = arr.length,
      taken = new Array(len);
    while(n--) {
      var x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
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

  loadNewTemps = () => {
    this.setState({
      list: [],
      refresh: true
    })
    this.fetchTemps()
  }

  fetchCityTemp = (city, country, newList) => {
    fetch('http://api.openweathermap.org/data/2.5/weather?q='+city+','+country+'&appid=616f7c6ebf57cf29940a19c2fbf3c76b&units=imperial')
    .then((response) => response.json())
    .then((responseJson) => {
      var res = responseJson.main
      var obj = responseJson // to access all of the variable when in need
      var city = {
        name: obj.name,
        country: country,
        temp: Math.ceil(res.temp),
        type: obj.weather[0].main,
        desc: 'Humidity: ' + res.humidity + '% - '+ obj.weather[0].main
      }

      newList.push(city)
      console.log(newList)
      this.setState({
        list: newList,
        refresh: false
      })
    })
  }

  // alert( item.desc )
  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle='light-content' />
        <Text style={styles.title}> 🌤City Weather </Text>
        <FlatList
          // add props here
          style = {{width: '100%'}}
          data = { this.state.list }
          refreshing = { this.state.refresh }
          onRefresh = { this.loadNewTemps }
          keyExtractor = {(item, index) => index.toString()}
          renderItem = {({item, index}) => (
            <TouchableHighlight
              underlayColor = 'white'
              onPress = { () => this.setState({newAlert: 1, alertMsg: item.desc})}
            
            >
              <LinearGradient
                colors = {['rgba(0, 0, 0, 0.08)', 'rgba(0, 0, 0, 0)']}
                start = {[0, 0.5]}
              >
              <View style={styles.row}>
                <Text style={[
                  (this.getTempRange(item.temp) == 1) ? styles.cold : styles.temp,
                  (this.getTempRange(item.temp) == 2) ? styles.medium : styles.temp,
                  (this.getTempRange(item.temp) == 3) ? styles.hot : styles.temp,
                  (this.getTempRange(item.temp) == 4) ? styles.vhot : styles.temp,
                  styles.cityTemp]}> {this.getEmoji(item.type)} { item.temp }°C</Text>
                <Text style={styles.cityName}>{ item.name } </Text>
              </View>
              </LinearGradient>
            </TouchableHighlight>
          )} // this is where we display all of the elements

        />

        // alert changes
        {
          this.state.newAlert == 1 ? (
            <View style={{flex:1, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0, height: '100%', width: '100%', backgroundColor: 'rgba(0,0,0,0.5)'}}>
              <View style={{width:'75%', height: 90}}>

                <LinearGradient
                  style={{
                    padding:5,
                    shadowColor: 'black', shadowOffset: { width:0, height: 2}, shadowOpacity: 0.3, shadowRadius: 2,
                    justifyContent: 'space-between', flex: 1, borderRadius: 20}}
                  colors={['#136a8a', '#267871']}
                  start={[0, 0.65]}
                >
                  <Text style={{fontSize: 16, color: 'white', padding: 10, textAlign: 'center'}}>{this.state.alertMsg}</Text>

                  <TouchableHighlight
                    underlayColor="white"
                    onPress={ () => this.setState({alertMsg: '', newAlert: 0})}
                  >
                    <Text style={{fontWeight: 'bold', color: 'white', padding: 10, textAlign: 'center'}}>Close</Text>
                  </TouchableHighlight>
                </LinearGradient>
              </View>
            </View>
          ) : ''
        }
      </View>


    )
  }
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    justifyContent: 'center', 
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
  row: {
    flex: 1,
    width: Dimensions.get('window').width,
    paddingVertical: 25,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomcolor: 'black'
  },
  cityTemp: {
    fontSize: 30,
    lineHeight: 40,
    width: 130,
    marginRight: 15,
    fontWeight: 'bold',
    fontFamily: 'Avenir'
  }, 
  cityName: {
    fontSize: 20,
    lineHeight: 40,
    fontFamily: 'Avenir'
  },
  cold: {
    color: 'light-blue'
  },
  medium: {
    color: 'orange'
  },
  hot: {
    color: 'red'
  },
  vhot: {
    color: 'red'
  }

})