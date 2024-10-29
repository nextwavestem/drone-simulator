export const getImagePrefix = (image) => {
    if (window.location.hostname.includes('localhost')) {
      return '/assets/' + image;
    }
  
    return '/drone-simulator/assets/' + image;
  };

export const projects = () => {
    return [
        { 
            id: 1, 
            link: "/space/",
            title: "Space Simulator", 
            image: getImagePrefix("fixtures/space_2.png"), 
            detail: "Learn how to navigate your drone in space using blocky",
            description1: "Experience the thrill of space exploration with our Drone Simulator! This innovative platform allows you to control a virtual drone using intuitive Blockly code, making programming accessible and fun. Navigate through a stunning 3D environment, discovering planets, moons, and the International Space Station (ISS).",
            description2: "With realistic flight physics and an engaging user interface, our simulator invites users of all ages to embark on exciting missions. Explore the cosmos, learn about space navigation, and unleash your creativity as you chart your course through the stars. Join us in launching this extraordinary journey into space!"
        },
        { 
            id: 2, 
            link: "/city/",
            title: "City", 
            image: getImagePrefix("fixtures/city_2.png"), 
            detail: "Learn how to navigate your drone in a city using blocky",
            description1: "In the simulator, users take control of a drone, learning essential flight actions such as takeoff, landing, and maneuvering in three-dimensional space. As they explore, children can complete tasks that encourage critical thinking and spatial awareness, all while gaining practical knowledge about drone operation and safety.",
            description2: "The City Drone Simulator not only fosters creativity and curiosity but also introduces children to the principles of aviation and technology in an engaging way. It’s a unique blend of play and education, making learning about drones both enjoyable and accessible. With its user-friendly interface and captivating city environment, this simulator is the perfect platform for young adventurers to take flight!"
        },
    ]
}




