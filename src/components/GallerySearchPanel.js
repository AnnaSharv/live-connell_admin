import React, {useEffect, useState} from 'react'
import { Input, Select } from 'antd';

function GallerySearchPanel({gallery, filteredGallery, setFilteredGallery}) {
    const [dates, setDates] = useState([{
        label:"",
        value:""
    }]);
    const [currentDate, setCurrentDate] = useState('');
    const [input, setinput] = useState(null)
    const [select, setselect] = useState(null)


  


    useEffect(() => {
        if(input === "clearInput") {
            setFilteredGallery(gallery)
            setinput(null)
        }
        if(input?.length === 0) {
            setFilteredGallery(gallery)
            setinput(null)
        }
        if(input && select) {

            const filteredGallery = gallery?.filter((item,i) => {
                const timeStamp = item.timeStamp
                const name = item.blog_image_name 
    
                //convert item timestamp to Month Year && image name
                const date = new Date(timeStamp);
                const formattedDate = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    
                
                return name?.toLowerCase().includes(input.toLowerCase()) && formattedDate.includes(select) 
            })
            setFilteredGallery(filteredGallery)
        } 

        if(input && !select) {
            const searchImage = gallery.filter((item,i) => {
                const name = item.blog_image_name 
                if(name && name?.length > 0) {
                    return name.toLowerCase().includes(input.toLowerCase())
                }
            })
            setFilteredGallery(searchImage)
        }
        if(select && !input) {
            const filteredGallery = gallery?.filter((item,i) => {
                const timeStamp = item.timeStamp
    
                //convert item timestamp to Month Year
                const date = new Date(timeStamp);
                const formattedDate = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    
                
                return formattedDate.includes(select)
            })
            setFilteredGallery(filteredGallery)
        }
        else {
            console.log("searching...", input)
        }

       

    }, [input, select])
    


    //ინფუტ
    const onChange = (e) => {
         //searchGallery(e.target.value)
         setinput(e.target.value)
    };


    //სელეცტ
    const onChangeSelect = (value) => {
         //filterGallery(value)
         setselect(value)

      };
 

    useEffect(() => {
        let curryear = new Date().getFullYear();
        let currmonth =  new Date().getMonth()

        const startDate = new Date(2023, 1); 
        const endDate = new Date(curryear, currmonth); 
        const currentDate = new Date();
        const formattedDates = [];

        for (let date = startDate; date <= endDate; date.setMonth(date.getMonth() + 1)) {
            const formattedDate = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
            formattedDates.unshift({label:formattedDate, value: formattedDate});

            if (date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear()) {
                setCurrentDate(formattedDate);
            }
        }

        setDates(formattedDates);
    }, []);

   

  return (
    <div style={styles.wrapper}>
        <div style={styles.flex}>
            <label style={styles.label}>Search</label>
            <Input size="large" allowClear onChange={onChange} style={{minWidth: 250}}/>
        </div>
        <div>
        <label style={styles.label}>Filter by date</label>

        <Select
            className='uploadfromgallery'
            
            allowClear
            size="large"
            defaultValue={{
                value: 'all',
                label: 'All dates',
            }}
            placeholder="All Dates"
            style={{minWidth: 250}}
            optionFilterProp="children"
            onChange={onChangeSelect}
            onClear={() => setinput("clearInput")}
            filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={[dates][0]}
        />
        </div>
    </div>
  )
}

export default GallerySearchPanel

const styles = {
    wrapper: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: 20,
        width: "100%"
    },
    flex: {
        display: 'flex',
        alignItems: 'center',
        marginRight: 30
    },
    label: {
        marginRight: 10,
        fontFamily: 'PoppinsBol'
    }
}