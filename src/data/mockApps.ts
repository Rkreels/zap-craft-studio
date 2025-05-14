
import { AppItem } from "@/components/zap-creator/AppSelector";
import { TriggerEvent } from "@/components/zap-creator/EventSelector";

export const mockApps: AppItem[] = [
  { id: "gmail", name: "Gmail", icon: "G", description: "Send and manage emails", color: "bg-red-500", popular: true },
  { id: "slack", name: "Slack", icon: "S", description: "Chat and collaboration", color: "bg-green-500", popular: true },
  { id: "sheets", name: "Google Sheets", icon: "Sh", description: "Spreadsheet management", color: "bg-green-700", popular: true },
  { id: "trello", name: "Trello", icon: "T", description: "Project management", color: "bg-blue-500", popular: true },
  { id: "twitter", name: "Twitter", icon: "Tw", description: "Social media engagement", color: "bg-blue-400" },
  { id: "mailchimp", name: "Mailchimp", icon: "M", description: "Email marketing", color: "bg-yellow-500" },
  { id: "dropbox", name: "Dropbox", icon: "D", description: "File storage", color: "bg-blue-600" },
  { id: "asana", name: "Asana", icon: "A", description: "Task management", color: "bg-pink-500" },
  { id: "github", name: "GitHub", icon: "GH", description: "Code management", color: "bg-gray-800" },
  { id: "stripe", name: "Stripe", icon: "St", description: "Payment processing", color: "bg-purple-600" },
  { id: "jira", name: "Jira", icon: "J", description: "Issue tracking", color: "bg-blue-700" },
  { id: "salesforce", name: "Salesforce", icon: "SF", description: "CRM platform", color: "bg-blue-800" },
];

export const getTriggerEventsForApp = (appId: string): TriggerEvent[] => {
  switch (appId) {
    case "gmail":
      return [
        { 
          id: "new_email", 
          name: "New Email", 
          description: "Triggers when a new email is received", 
          appId: "gmail" 
        },
        { 
          id: "new_labeled_email", 
          name: "New Labeled Email", 
          description: "Triggers when an email receives a specific label", 
          appId: "gmail" 
        },
        { 
          id: "new_attachment", 
          name: "New Attachment", 
          description: "Triggers when an email contains attachments", 
          appId: "gmail" 
        },
      ];
    case "slack":
      return [
        { 
          id: "new_message", 
          name: "New Message", 
          description: "Triggers when a new message is posted to a channel", 
          appId: "slack" 
        },
        { 
          id: "new_channel", 
          name: "New Channel", 
          description: "Triggers when a new channel is created", 
          appId: "slack" 
        },
        { 
          id: "new_mention", 
          name: "New Mention", 
          description: "Triggers when you are mentioned in a message", 
          appId: "slack" 
        },
      ];
    case "sheets":
      return [
        { 
          id: "new_row", 
          name: "New Spreadsheet Row", 
          description: "Triggers when a new row is added to a spreadsheet", 
          appId: "sheets" 
        },
        { 
          id: "updated_row", 
          name: "Updated Spreadsheet Row", 
          description: "Triggers when a row is updated in a spreadsheet", 
          appId: "sheets" 
        },
      ];
    case "trello":
      return [
        { 
          id: "new_card", 
          name: "New Card", 
          description: "Triggers when a new card is created", 
          appId: "trello" 
        },
        { 
          id: "card_moved", 
          name: "Card Moved", 
          description: "Triggers when a card is moved to a different list", 
          appId: "trello" 
        },
        { 
          id: "new_comment", 
          name: "New Comment", 
          description: "Triggers when a comment is added to a card", 
          appId: "trello" 
        },
      ];
    // Add more apps as needed
    default:
      return [
        { 
          id: "default_trigger", 
          name: "New Event", 
          description: "A generic trigger for this app", 
          appId 
        }
      ];
  }
};

export const getActionEventsForApp = (appId: string): TriggerEvent[] => {
  switch (appId) {
    case "gmail":
      return [
        { 
          id: "send_email", 
          name: "Send Email", 
          description: "Sends a new email", 
          appId: "gmail" 
        },
        { 
          id: "add_label", 
          name: "Add Label", 
          description: "Adds a label to an email", 
          appId: "gmail" 
        },
      ];
    case "slack":
      return [
        { 
          id: "send_message", 
          name: "Send Message", 
          description: "Sends a message to a channel", 
          appId: "slack" 
        },
        { 
          id: "create_channel", 
          name: "Create Channel", 
          description: "Creates a new channel", 
          appId: "slack" 
        },
      ];
    case "sheets":
      return [
        { 
          id: "add_row", 
          name: "Add Row", 
          description: "Adds a row to a spreadsheet", 
          appId: "sheets" 
        },
        { 
          id: "update_row", 
          name: "Update Row", 
          description: "Updates a row in a spreadsheet", 
          appId: "sheets" 
        },
      ];
    // Add more apps as needed
    default:
      return [
        { 
          id: "default_action", 
          name: "Default Action", 
          description: "A generic action for this app", 
          appId 
        }
      ];
  }
};
