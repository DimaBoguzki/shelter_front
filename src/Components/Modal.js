import ReactDOM from "react-dom";
import React, { useEffect } from 'react';

export default function Modal({close, children, width}) {
  const { REACT_APP_IMG_PATH } = process.env;

	useEffect(() => {
		let el = document.getElementsByTagName('body')[0];
		el.classList.add('modal-open');
		return () => {
			el.classList.remove('modal-open');
		};
	}, []);
	return ReactDOM.createPortal(
		<div className={'popup'}>
			<div className="popup-wrapper" style={{width: width ? width : 'auto'}}>
        <div onClick={close} className="close">
          <img src={REACT_APP_IMG_PATH+'/icons/admin/close.svg'} alt=""/>
        </div>
				{children}
			</div>
			<div onClick={close} className="outline"></div>
		</div>,
		document.getElementById('modal-root')
	);
}

