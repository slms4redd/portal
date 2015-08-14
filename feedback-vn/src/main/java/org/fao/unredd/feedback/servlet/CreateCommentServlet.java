package org.fao.unredd.feedback.servlet;

import java.io.IOException;
import java.util.Locale;
import java.util.ResourceBundle;

import javax.mail.MessagingException;
import javax.mail.internet.AddressException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.fao.unredd.feedback.Feedback;
import org.fao.unredd.feedback.MissingArgumentException;
import org.fao.unredd.portal.Config;
import org.fao.unredd.portal.StatusServletException;

public class CreateCommentServlet extends HttpServlet {
	private static final String OTHER = "other";
	private static final long serialVersionUID = 1L;

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

		Config config = (Config) req.getServletContext().getAttribute("config");
		Locale locale = (Locale) req.getAttribute("locale");
		ResourceBundle messages = config.getMessages(locale);

		String email = req.getParameter("email");
		String affiliation = req.getParameter("affiliation");
		if (affiliation.equals(OTHER)) {
			affiliation += ": "+ req.getParameter("affiliation_other");
		}
		
		String location 	 = req.getParameter("location");
		String locationOther = req.getParameter("location_other");
		if (location.equals(OTHER) && StringUtils.isNotBlank(locationOther)) {
			location += ": "+ locationOther;
		}
		String comments = req.getParameter("comments");

		try {
			checkNull("email", email);
			checkNull("affiliation", affiliation);
			checkNull("location", location);
			checkNull("comments", comments);
			
			Feedback feedback = (Feedback) req.getServletContext().getAttribute("feedback");
			
			feedback.send(email, affiliation, location, comments);

			resp.setContentType("text/plain");
			resp.setStatus(200);
			
		} catch (MissingArgumentException e) {
			throw new StatusServletException(400, messages.getString("Feedback.all_parameters_mandatory") , e);
		} catch (AddressException e) {
			throw new StatusServletException(500, messages.getString("Feedback.error_sending_mail") + email, e);
		} catch (MessagingException e) {
			throw new StatusServletException(500, messages.getString("Feedback.error_sending_mail") + email, e);
		}
	}
	
	
	private void checkNull(String paramName, String paramValue) throws MissingArgumentException {
		if (paramValue == null) {
			throw new MissingArgumentException(paramName);
		}
	}
	
}
