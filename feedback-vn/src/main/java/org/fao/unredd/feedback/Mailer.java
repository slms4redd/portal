package org.fao.unredd.feedback;

import java.util.Properties;

import javax.mail.Authenticator;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.servlet.ServletContext;

public class Mailer {

	private String host;
	private String port;
	private String userName;
	private String password;
	private String title;
	private String recipient;

	public Mailer(Properties properties) throws MissingArgumentException {
		this(
				properties.getProperty("feedback-mail-host"), 
				properties.getProperty("feedback-mail-port"), 
				properties.getProperty("feedback-mail-username"), 
				properties.getProperty("feedback-mail-password"), 
				properties.getProperty("feedback-admin-mail-title"),
				properties.getProperty("feedback-mail-recipient")
		);
	}
	
	public Mailer(ServletContext servletContext)  throws MissingArgumentException {
		this(
				servletContext.getInitParameter("feedback-mail-host"), 
				servletContext.getInitParameter("feedback-mail-port"), 
				servletContext.getInitParameter("feedback-mail-username"), 
				servletContext.getInitParameter("feedback-mail-password"), 
				servletContext.getInitParameter("feedback-admin-mail-title"),
				servletContext.getInitParameter("feedback-mail-recipient")
		);
	}
	
	public Mailer(String host, String port, String userName, String password, String title, String recipient) throws MissingArgumentException {
		this.host 		= checkNull( host );
		this.port 		= checkNull( port );
		this.userName 	= checkNull( userName );
		this.password 	= checkNull( password );
		this.title 		= checkNull( title );
		this.recipient 	= checkNull( recipient );
		
		// this.verifiedMessage = checkNull(verifiedMessage);
	}

	private String checkNull(String value) throws MissingArgumentException {
		if (value != null) {
			return value;
		} else {
			throw new MissingArgumentException(value);
		}
	}

	private void sendMail( String host , String port, final String userName , final String password , 
			String recipient, String title, String text, String replyTo  ) throws MessagingException, AddressException {
		// sets SMTP server properties
		Properties properties = new Properties();
		properties.put("mail.smtp.auth", "true");
		properties.put("mail.smtp.starttls.enable", "true");
		properties.put("mail.smtp.host", host);
		properties.put("mail.smtp.port", port);

		// creates a new session with an authenticator
		Authenticator auth = new Authenticator() {
			public PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(userName, password);
			}
		};
		Session session = Session.getInstance(properties, auth);
		
		Message msg = new MimeMessage(session);
		
		msg.setFrom(new InternetAddress(userName));
		
		msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse( recipient ) );
		
		msg.setSubject(title);
//		msg.setSentDate(new Date());
		
		msg.setReplyTo( InternetAddress.parse(replyTo) );
		
		// set plain text message
		msg.setText(text);

		// sends the e-mail
		Transport.send(msg);
	}

	public void sendFeedback( String replyTo, String message ) throws AddressException, MessagingException {
		this.sendMail(this.host, this.port, this.userName, this.password, this.recipient, this.title, message, replyTo);
	}
	
}
