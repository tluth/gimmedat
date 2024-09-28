def file_recipient_template(
    sender: str,
    link: str,
    file_name: str,
    expiry_hours: str
) -> str:
    return f"""
        <html lang="en">
            <head>
                <meta http-equiv="content-type" content="text/html; charset=ISO-8859-1">
            </head>
            <body>
                <p>Hi there,</p>
                <br/>
                <p>
                    <b>{sender}</b> would like to share the following file with you:
                </p>
                <p>
                    <b>{file_name}</b> (expires in {expiry_hours} hours)
                </p>
                <p>
                    The file can be downloaded from <a href="{link}">here</a>.
                </p>
                <br/>
                <p>
                    Please don't open the link if you don't recognise the sender mentioned above.
                    If you're receiving unwanted emails from this address, and/or you suspect 
                    that someone is using our services to spam you with emails, please
                    contact us using the contact form <a href="https://gimmedat.bulgingdiscs.fun/contact">here</a>
                </p>
                <p>Regards,</p>
                <p>Gimmedat</p>
                <hr>
            </body>
        </html>
    """
