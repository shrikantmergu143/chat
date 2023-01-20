/* eslint-disable */
import React, { useState } from 'react';
import { Image } from 'react-bootstrap';
import Slider from "react-slick";
import Tooltip from './tooltip';

const PreviewPopup = (props) => {
    const { CurrentVideoImage, setPreviewImageVideo } = props;
    const [ currentSelectedFile, setCurrentSelectedFile ] = useState({
        id: CurrentVideoImage.id,
        base64: CurrentVideoImage.url,
        name: CurrentVideoImage.name
    });

    var settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 10,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
            {
              breakpoint: 1438,
              settings: {
                slidesToShow: 7,
                slidesToScroll: 1,
                infinite: false,
                dots: false
              }
            },
            {
              breakpoint: 991,
              settings: {
                slidesToShow: 6,
                slidesToScroll: 1,
                infinite: false,
                dots: false
              }
            },
            {
              breakpoint: 480,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1
              }
            }
        ]
    };
    function SampleNextArrow(props) {
        const { className, onClick } = props;
        return (
          <div
            className={className}
            onClick={onClick}
          />
        );
    }
      
    function SamplePrevArrow(props) {
        const { className, onClick } = props;
        return (
            <div
            className={className}
            onClick={onClick}
            />
        );
    }


    // tab select images aur video
    const SelectNewFile = (elm) => {
        // console.log("elm321========>", elm)
        setCurrentSelectedFile({...currentSelectedFile, id: elm?.file?.id, base64: elm?.file?.name, name: elm?.file?.name})
    }

    // download file function
    const DownloadFile = () => {
        const Url = currentSelectedFile?.base64;

        fetch(Url)
            .then((response) => response.blob())
            .then((blob) => {
                const blobUrl = URL.createObjectURL(blob);
                const tempAnchor = document.createElement("a");
                tempAnchor.download = currentSelectedFile?.name;
                tempAnchor.href = blobUrl;
                document.body.appendChild(tempAnchor);
                tempAnchor.click();
                tempAnchor.remove();
        });
    }

    return (
        <div className="ImageViewPreviewModal Files_preview Profile_view" onClick={(e) =>{
            e.stopPropagation();
            e.preventDefault()
        }} >
            <div className='modal_body'>
                {/* {console.log("AllImageArray======>", CurrentVideoImage)} */}
                {/* preview files control bar here */}
                <div className='controlbars'>
                    {/* <Tooltip content="Download" direction="bottom">
                        <Image src={Download} onClick={() => DownloadFile()} alt="Download" />
                    </Tooltip>
                    <Tooltip content="Save" direction="bottom">
                        <Image src={Save} alt="Save" />
                    </Tooltip>
                    <Tooltip content="Forword" direction="bottom">
                        <Image src={Forword} alt="Forword" />
                    </Tooltip> */}
                    <div></div>
                    <Tooltip content="Close" direction="bottom">
                        {/* <Image src={Cancel}  alt="Cancel" /> */}
                        <button onClick={(e) =>{
                            e.stopPropagation();
                            e.preventDefault()
                            setPreviewImageVideo(false)
                        }} className='btn cancel'></button>
                        
                    </Tooltip>
                </div>

                {/* preview files tab conent start here */}
                <div className="imageViewMain">
                    <Image src={currentSelectedFile?.base64} alt={currentSelectedFile?.name} />
                </div>
            </div>
        </div>
    )
}

export default PreviewPopup;