function renderSavedBar() {

    return (
        <View
            style={{
                flexDirection:'row',
                justifyContent:'center',
                backgroundColor:COLORS.lightGray,
            }}
        >
            <View
                style={{
                    backgroundColor:COLORS.lightGray,
                    width:"90%",
                    justifyContent:'space-evenly',
                    borderRadius:SIZES.radius,
                }}
            >
                <View
                    style={{
                        flexDirection:'row',
                        justifyContent:'space-evenly',
                        padding:SIZES.padding,
                    }}
                >
                    <TouchableOpacity
                        style={{
                            flexDirection:'row',
                            width:85,
                            backgroundColor:COLORS.lightGray2,
                            alignItems:'center',
                            padding: SIZES.padding,
                            borderRadius:SIZES.radius,
                            ...styles.shadow
                        }}
                        onPress={() => navigation.navigate('StartUp')}
                    >
                        <Image source={icons.search} style={{ height:15, width:15 }}/>
                        <Text style={{ fontSize:16, paddingRight:SIZES.padding/1.5, paddingLeft: SIZES.padding/1.5 }} numberOfLines={1} ellipsizeMode='tail'>Home</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={{
                            flexDirection:'row',
                            width:85,
                            backgroundColor:COLORS.lightGray2,
                            alignItems:'center',
                            padding: SIZES.padding,
                            borderRadius:SIZES.radius,
                            ...styles.shadow
                        }}
                        onPress={() => navigation.navigate('Comparison')}
                    >
                        <Image source={icons.fire} style={{ height:19, width:19 }}/>
                        <Text style={{ fontSize:16, paddingRight:SIZES.padding/1.5, paddingLeft: SIZES.padding/1.5 }} numberOfLines={1} ellipsizeMode='tail'>Work</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            flexDirection:'row',
                            width:88,
                            backgroundColor:COLORS.lightGray2,
                            alignItems:'center',
                            padding: SIZES.padding,
                            borderRadius:SIZES.radius/3,
                            ...styles.shadow
                        }}
                    >
                        <Image source={icons.basket} style={{ height:16, width:16 }}/>

                        {/* this is how you ensure there is the '...' to represent the truncated text! */}
                        <Text style={{ fontSize:17, paddingRight:SIZES.padding/1.5, paddingLeft: SIZES.padding/1.5 }} numberOfLines={1} ellipsizeMode='tail'>Saved</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

// for picking pick up location 
<GooglePlacesAutocomplete
    styles={{
        container:{
            paddingLeft:SIZES.padding,
            width:"100%",
        },
        
        textInput:{
            fontSize:16.5
        },
        listView:{
            position:'absolute',
            top:160,
            left:SIZES.padding
        },
    }}
    placeholder='From?'
    onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        // you will setDestinationPlace to an object containing data and details 
        setOriginPlace( {data, details} );
        console.log('pressed');
    }}
    fetchDetails={true}
    suppressDefaultStyles
    query={{
        key: googleAPIKey,
        language: 'en',
        // this component will allow for selecting the countries you want to show results for!
        components:'country:sg',
    }}
    // this is how you adjust the drop list style!
    renderRow={(data) => <PlaceRow data={data} />}
    renderDescription={(data) => data.description || data.vicinity}

    enablePoweredByContainer={false}

    // this is how you get the Current Location option in the dropDown List!
    currentLocation={true}
    currentLocationLabel='Current Location'
/>, 

// for picking the drop off locations 
<GooglePlacesAutocomplete
    styles={{
        textInput:{
            fontSize:16.5
        },
        container:{
            paddingLeft:SIZES.padding,
            width:"100%"
            
        },
        listView:{
            position:'absolute',
            top:110,                                
        },
    }}
    placeholder='Where To?'
    onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        // you will setDestinationPlace to an object containing data and details 
        setDestinationPlace( {data, details} )
        console.log(data, details);
    }}
    fetchDetails={true}
    suppressDefaultStyles
    query={{
        key: googleAPIKey,
        language: 'en',
        // this component will allow for selecting the countries you want to show results for!
        components:'country:sg',
    }}
    // this is how you adjust the drop list style!
    renderRow={(data) => <PlaceRow data={data} />}
    enablePoweredByContainer={false}
/>


<View
                        style={{
                            backgroundColor:COLORS.lightGray3,
                            width:"90%",
                            height:65,
                            marginTop:SIZES.padding,
                            justifyContent:'space-evenly',
                            borderRadius:SIZES.radius,
                        }}
                    ></View>

{/* <View
                            style={{
                                flexDirection:'row',
                                justifyContent:'space-evenly',
                                padding:SIZES.padding,
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    flexDirection:'row',
                                    width:85,
                                    backgroundColor:COLORS.lightGray2,
                                    alignItems:'center',
                                    padding: SIZES.padding,
                                    borderRadius:SIZES.radius,
                                    ...styles.shadow
                                }}
                                onPress={() => navigation.navigate('StartUp')}
                            >
                                <Image source={icons.search} style={{ height:15, width:15 }}/>
                                <Text style={{ fontSize:16, paddingRight:SIZES.padding/1.5, paddingLeft: SIZES.padding/1.5 }} numberOfLines={1} ellipsizeMode='tail'>Home</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                style={{
                                    flexDirection:'row',
                                    width:85,
                                    backgroundColor:COLORS.lightGray2,
                                    alignItems:'center',
                                    padding: SIZES.padding,
                                    borderRadius:SIZES.radius,
                                    ...styles.shadow
                                }}
                            >
                                <Image source={icons.fire} style={{ height:19, width:19 }}/>
                                <Text style={{ fontSize:16, paddingRight:SIZES.padding/1.5, paddingLeft: SIZES.padding/1.5 }} numberOfLines={1} ellipsizeMode='tail'>Work</Text>
                            </TouchableOpacity> */}