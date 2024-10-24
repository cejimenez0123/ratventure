function setCookie(name, value, days) {
    localStorage.setItem(name,value)
    // const date = new Date();
    // date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    // const expires = "expires=" + date.toUTCString();
    // document.cookie = name + "=" + value + ";" + expires + ";path=/";
  }
  
  function getCookie(name) {
    return localStorage.getItem(name)
    // const value = "; " + document.cookie;
    // const parts = value.split("; " + name + "=");
    // if (parts.length === 2) return parts.pop().split(";").shift();
}
function clearCookie(name) {
    localStorage.clear()
    // Set the cookie's expiration to a past date
   // document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
  
 


export {getCookie,setCookie,clearCookie}