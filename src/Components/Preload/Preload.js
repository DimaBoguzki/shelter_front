import React from 'react';
import './Preload.scss';

export default function Preload ({preload}){
	React.useEffect(()=>{
		if(preload)
			document.getElementsByTagName("BODY")[0].classList.add('fix');
		else
			document.getElementsByTagName("BODY")[0].classList.remove('fix');
		return () => {
			document.getElementsByTagName("BODY")[0].classList.remove('fix');
		};
	},[preload]);
	
	if (preload) {
		return(
			<div className="spinner-wrapper">
				<div className="spinner">
					<div className="bounce1"></div>
					<div className="bounce2"></div>
					<div className="bounce3"></div>
				</div>
			</div>
		);
	} else return null;
}


