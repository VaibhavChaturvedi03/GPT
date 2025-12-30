import './Sidebar.css';

function Sidebar(){
    return(
        <section className="sidebar">
            <button>
                <img src="src/assets/blacklogo.png" alt="gpt logo" />
                <i className="fa-solid fa-pen-to-square"></i> {/* icon from font awesome */}
            </button>

            <ul className="history">
                <li>history1</li>
                <li>history2</li>
                <li>history3</li>
            </ul>

            <div className="sign">
                <p>By Vaibhav</p>
            </div>
        </section>
    )
}

export default Sidebar;