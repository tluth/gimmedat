import logging
from collections import namedtuple
from email.mime.application import MIMEApplication
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import boto3

from email_sender.config import appconfig


logger = logging.getLogger(__name__)
ses = boto3.client("ses")
Attachment = namedtuple("Attachment", ["name", "content_type", "content"])


class Email(object):
    def __init__(self, to, subject):

        if isinstance(to, str):
            self.to = [to]
        elif isinstance(to, list):
            self.to = to
        else:
            raise Exception("Invalid email address")
        self._domain = appconfig.domain
        self.subject = subject
        self._html = None
        self._text = None
        self._format = "html"
        self.attachments = []

    def html(self, html):
        self._html = html

    def text(self, text):
        self._text = text

    def add_attachment(self, attachment, content_type, attachment_name):
        self.attachments.append(
            Attachment(attachment_name, content_type, attachment))

    def send(self, from_addr=None):

        body = self._html
        if not from_addr:
            from_addr = "no-reply@{}".format(self._domain)
        if not self._html and not self._text:
            raise Exception("You must provide a text or html body.")
        if not self._html:
            self._format = "text"
            body = self._text

        msg = MIMEMultipart()
        msg["Subject"] = self.subject
        msg["From"] = from_addr
        msg["To"] = ",".join(self.to)

        if len(self.attachments) > 0:
            for att in self.attachments:
                part = MIMEApplication(att.content)
                part.add_header(
                    "Content-Disposition", "attachment", filename=att.name)
                part.add_header("Content-Type", att.content_type)
                msg.attach(part)

        part2 = MIMEText(body, "html")
        msg.attach(part2)

        return ses.send_raw_email(
            Source="no-reply@{}".format(self._domain),
            Destinations=self.to,
            RawMessage={"Data": msg.as_string()},
        )


def format_response(status_code, body):
    return {
        "isBase64Encoded": False,
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        "body": body,
    }


def lambda_handler(event, context):
    logger.info(
        f"Processing email to: {event['recipient_email']}"
    )
    email = Email(
        to=event["recipient_email"], subject=event["email_subject"])
    email.text(event["content"])
    email.html(event["content"])
    for v in event["attachments"]:
        email.add_attachment(
            v["content"], v["content_type"], v["name"])
    email.send()

    return format_response(200, {"message": "OK"})
