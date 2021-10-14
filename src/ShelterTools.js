
export class ShelterTools{
  static Status=[
    {Title:'מקלט תקין', ColorCode:'#10c932'},
    {Title:'מקלט בשיפוץ', ColorCode:'#ff8c40'},
    {Title:'מקלט שמיש אך לא מוכן לשעת חירום', ColorCode:'#e100ff'},
    {Title:'מקלט לא תקין', ColorCode:'#ff0000'},
  ]
  /**
   * @param   {Array} Inspections   array inspections shelter
   * @param   {Array} Works         array  works  shekter
   * @param   {?String} Works       witch use use shelter can be null
   * @returns { Object } { ColorCode, TitleStatus }
   */
  static getStatus=(Inspections, Works, UseShelter)=>{
    if(Works){
      const workShelter=Works.find(x=>!x.IsComplete);
      if(workShelter)
        return ShelterTools.Status[1]; // מקלט בשיפוץ
    }
    else if(Inspections && Inspections.length){
      // look for index last valid inspection
      let inspectionBeforeDay=360;
      const ValidInspection=Inspections.filter(x=>x.IsValid);
      for (let i = 0; i < ValidInspection.length; i++) {
        let tmp=ShelterTools.getDeltaDays(new Date(), new Date(ValidInspection[i].Date));
        if(tmp < inspectionBeforeDay)
          inspectionBeforeDay=tmp;
        if(inspectionBeforeDay < 360)
          break
      }
      if(inspectionBeforeDay > 360){
        if(UseShelter)
          return ShelterTools.Status[2]; // מקלט שמיש אך לא מוכן לשעת חירום
        else
          return ShelterTools.Status[3]; // מקלט לא תקין
      }
      else
        return ShelterTools.Status[0]; // מקלט תקין
      
    }// אין ביקורת למקללט ואין שיפוצים למקלט
    return UseShelter ? ShelterTools.Status[2] : ShelterTools.Status[3];
  }
  static getDeltaDays=(date1, date2)=>{
		// delta beween in milliseconds
		const diffTime = Math.abs(date2 - date1);
		// delta beween in days
		return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
	}
}