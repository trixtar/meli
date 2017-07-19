myFunctions = {
  getUrlParameter: function (name) {
      name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
      var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
      var results = regex.exec(location.search);
      return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  },

  currencySymbol: function (code) {
  	if (code == 'ARS') {
	  		return '$';
	  	} else if (code == 'USD') {
	  		return 'U$S';
	  	} else {return code;}
  }
}