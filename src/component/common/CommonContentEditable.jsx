/* eslint-disable */
import React, { useEffect, useState } from "react";
import EmojiPicker from "../common/emojiCustom/EmojiPicker";

const CommonContentEditable = (props) => {
    const { id, title, setIstextEmoji, setCurrentValue, UpdateOnWorkFunct } = props;
    const [ picker, setpicker ] = useState(false);
    
    // shift enter disable
    useEffect(() => {
        document.getElementById(id).addEventListener('keypress', (evt) => {
            if (evt.which === 13) {
                evt.preventDefault();
            }
        });
    }, []);

    // check content editable empty or not
    const getGroupTitle = (e) => {
        if(id === "GroupEditTextField") {
            setCurrentValue(e.target.innerText);
        }
        if(e.target.innerText) {
            setIstextEmoji(true);
        } else {
            setIstextEmoji(false);
        }
    };  

    useEffect(() => {
        if(id === "GroupEditTextField") {
            var currentmsghtml = document.getElementById(id)?.innerText;
            setCurrentValue(currentmsghtml);
        }
    }, [ picker ]);

    return(<div className="customTextField">
        <div 
            className={title === "editgroups" ? "commonCustomTextfield edit_groups" : title === "New Group" ? "commonCustomTextfield Groups" : "commonCustomTextfield broadcast"} 
            id={id}
            contentEditable={true} 
            onInput={(e) => getGroupTitle(e)}
            onKeyPress={(e) => UpdateOnWorkFunct(e)}
            data-text=""
            placeholder=""
        />
        <div className="emojitextfieldicon" onClick={() => setpicker(!picker)}></div>
        {picker && <EmojiPicker setpicker={setpicker} setIstextEmoji={setIstextEmoji} id={id} />}
    </div>)
}

export default CommonContentEditable;