exec { "apt-get update" :
	path => "/usr/bin",
}

# Class:  apache2
# install and starts apache2
#
class  apache2 {
	package { "apache2":
		ensure => present,
		require => Exec["apt-get update"],
	}

	service { "apache2":
	    enable => true,
		ensure => running,
		#hasrestart => true,
		#hasstatus => true,
		require => Package["apache2"],
	}
}

# Class: ruby
#
#
class ruby {
	package{ "ruby1.9.1-full":
		ensure => present,
		require => Exec["apt-get update"],	
	}
}

class{"ruby" :}

# Class: sass
#
#
class sass {
	package { "sass":
		ensure => installed,
		provider => 'gem',
		require => Class["ruby"],
		
	}



	exec { "sass --watch /var/www/sasscss:/var/www/css &":
		require => Package["sass"],
		path => "/usr/local/bin/",
		#hasrestart => true,
		#hasstatus => true,
	}
}

include apache2
include sass

