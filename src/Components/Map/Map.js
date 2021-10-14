import React from 'react';
import GoogleMapReact from 'google-map-react';
import Icon from './Icon';
import { ShelterTools } from '../../ShelterTools';

export class MapTools{
	static API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
	static initialMap = {
    center: {
      lat: 32.91622878512039,
      lng: 35.29202452985414
    },
    zoom: 14.5
  };
	static getAddress=(lat, lng)=>{
		return new Promise((resolve, reject) => {
			return fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${MapTools.API_KEY}`)
			.then(response => response.json())
			.then(data=>resolve(data))
			.catch(err=>reject(err));
		})
	}
	static getCurentPostion=()=>{
		return new Promise((resolve, reject) => {
			if (navigator.geolocation) {
				return navigator.geolocation.getCurrentPosition((position)=>{
					resolve(position.coords);
				},
				(error)=>{
					switch(error.code) {
						case error.PERMISSION_DENIED:
							reject("User denied the request for Geolocation.")
							break;
						case error.POSITION_UNAVAILABLE:
							reject("Location information is unavailable.")
							break;
						case error.TIMEOUT:
							reject("The request to get user location timed out.")
							break;
						case error.UNKNOWN_ERROR:
							reject("An unknown error occurred.")
							break;
							default:
								reject('Error')
					}
				},{
					maximumAge:50000, 
					timeout:5000, 
					enableHighAccuracy:true
				})
			}
			reject('Browser not suported navigator');
		})
	}
	static getDistance(cord1, cord2){
		const R = 6378137; // Earth’s mean radius in meter
		const  rad = (x) => x * Math.PI / 180;
		let dLat = rad(cord2.lat - cord1.lat);
		let dLong = rad(cord2.lng - cord1.lng);
		let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +	Math.cos(rad(cord1.lat)) * Math.cos(rad(cord2.lat)) *	Math.sin(dLong / 2) * Math.sin(dLong / 2);
		let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		let d = R * c;
		return d; // returns the distance in meter
	};	
}

export class ChoicePoint extends React.PureComponent {
	render(){
		const { center } = this.props;
		return(
			<div className="map-wrapper">
				<div style={{ height: '80vh', width: '100%' }} className="my-map">
					<GoogleMapReact
						center={center ? center : MapTools.initialMap.center}
						zoom={center ? 18 : MapTools.initialMap.zoom}
						bootstrapURLKeys={{ key: MapTools.API_KEY }}
						defaultCenter={center ? center : MapTools.initialMap.center}
						defaultZoom={center ? 18 : MapTools.initialMap.zoom}
						onClick={(e)=>this.props.callBack(this.props.id, e)}
						streetView={true}
						options={(maps)=>{return {mapTypeControl: true}}}
						// options={(maps)=>{return {mapTypeControl: true, mapTypeId:'hybrid'}}}
					>
					{center ?
					<Point
						lat={center.Lat}
						lng={center.Lon}
						shelter={null}
					/> : null}
					</GoogleMapReact>
				</div>
			</div>
		)
	}
}
const Point = React.memo((params) => {
	const [toggle, setToggle]=React.useState(null);
	const getColor=()=>{
		const { shelter } = params
		let status=null
		if(shelter){
			status=ShelterTools.getStatus(shelter.Inspections, shelter.ShelterWorks, shelter.UseShelter);
		}
		
		return status ? status.ColorCode : "#000";
	}
	const renderConntent=()=>{
		const { REACT_APP_IMG_PATH } = process.env;
		return(
			<div className="conntent">
				<img className="close" src={REACT_APP_IMG_PATH+"/icons/cross-icon-small.svg"} alt="" onClick={()=>setToggle(null)}/>
				<label className="title">{toggle.Address}</label>
				<div>
					<label className="title"> ביקורת אחרונה : </label>
					<label>{toggle.Inspections && toggle.Inspections[0] ? toggle.Inspections[0].Date : ' אין '}</label>
				</div>
				<div>
					<label className="title"> שם איש קשר : </label>
					<label>{toggle.ContactName ?  toggle.ContactName : ' אין '}</label>
				</div>
				<div>
					<label className="title">  טלפון איש קשר : </label>
					<label>{toggle.ContactPhone ?  toggle.ContactPhone : ' אין '}</label>
				</div>
			</div>
		)
	}
	return(
		<div className="new-point">
			{toggle ? renderConntent() : null}
			<Icon color={getColor() } onClick={()=>setToggle(params.shelter)}/>
		</div>
	);
},(prevProps, nextProps)=>prevProps.shelter && nextProps.shelter && prevProps.shelter.Id===nextProps.shelter.Id);

export const SheltersMap = React.memo(({shelters, initialZoom})=>{
	return(
		<div className="map-wrapper">
			<div style={{ height: '80vh', width: '100%' }}>
				<GoogleMapReact
					center={MapTools.initialMap.center}
					zoom={initialZoom ? initialZoom : MapTools.initialMap.zoom}
					bootstrapURLKeys={{ key: MapTools.API_KEY }}
					defaultCenter={MapTools.initialMap.center}
					defaultZoom={initialZoom ? initialZoom : MapTools.initialMap.zoom}
					streetView={true}
					options={(maps)=>{return {mapTypeControl: true}}}
				>
				{shelters.map((shelter, i) => {
						return(
							<Point
								key={i}
								lat={shelter.Lat}
								lng={shelter.Lon}
								shelter={shelter}
							/>
						);
					})}
				</GoogleMapReact>
			</div>
		</div>
	)
	
},(prevProps, nextProps)=>prevProps.shelters.length === nextProps.shelters.length)
