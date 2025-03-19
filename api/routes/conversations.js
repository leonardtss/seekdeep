const User = require("../models/User");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const express = require("express");

const router = express.Router(); 


// Route pour créer une nouvelle conversation
router.post("/", async (req, res) => {
    try {
      const { userId, conversationId, messages } = req.body;
  
      // Vérifier si l'utilisateur existe
      const userExists = await User.findById(userId);
      if (!userExists) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }
  
      let conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        // Vérifier que messages n'est pas vide avant d'accéder à messages[0]
        if (!messages || messages.length === 0) {
          return res.status(400).json({ error: "Aucun message fourni" });
        }
  
        const title = messages[0].content.slice(0, 25); // Extraire le titre
  
        // Créer la conversation
        conversation = new Conversation({
          userId,
          title,
        });
  
        await conversation.save(); // Sauvegarder la nouvelle conversation
      }
  
      console.log(req.body);
  
      // Créer les messages et récupérer leurs IDs
      const messageDocs = await Message.insertMany(
        messages.map((msg) => ({
          conversationId: conversation._id,
          role: msg.role, 
          content: msg.content, 
        }))
      );
  
      // Ajouter les IDs des messages à la conversation
      conversation.messages.push(...messageDocs.map((msg) => msg._id));
      console.log(conversation.messages)
      // Sauvegarder la conversation mise à jour
      await conversation.save();
  
      return res.status(201).json({
        message: "Conversation créée",
        conversationId:conversation._id,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  });
  

  router.get("/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Vérifier si l'utilisateur existe
      const userExists = await User.findById(userId);
      if (!userExists) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }
  
      // Trouver toutes les conversations associées à l'utilisateur
      const conversations = await Conversation.find({ userId })
      // const conversations = await Conversation.find({ userId }).populate("messages");
  
      return res.status(200).json({
        message: "Conversations récupérées",
        conversations,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  });

  router.get("/onlyone/:conversationId", async (req, res) => {
    try {
      const { conversationId } = req.params;
      console.log(conversationId)
      // Vérifier si la conversation existe
      const convExists = await Conversation.findById(conversationId);
      if (!convExists) {
        return res.status(404).json({ error: "Conversation non trouvée" });
      }
  
      // Trouver la conversation en peuplant les messages
      const conversation = await Conversation.findById(conversationId).populate("messages");
  
      return res.status(200).json({
        message: "Conversation récupérée",
        conversation,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await Conversation.findByIdAndDelete(id);
      res.status(200).json({ message: "Conversation deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting conversation", error });
    }
  });
  

module.exports = router;