import logging
from typing import Any


logger = logging.getLogger(__name__)


class NotificationService:
    def notify_contact_request_created(self, payload: dict[str, Any]) -> None:
        logger.info("notification.contact_request_created", extra={"payload": payload})

    def notify_consultation_requested(self, payload: dict[str, Any]) -> None:
        logger.info("notification.consultation_requested", extra={"payload": payload})

    def notify_handoff_requested(self, payload: dict[str, Any]) -> None:
        logger.info("notification.handoff_requested", extra={"payload": payload})

    def notify_newsletter_subscribed(self, payload: dict[str, Any]) -> None:
        logger.info("notification.newsletter_subscribed", extra={"payload": payload})
