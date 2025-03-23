# Déploiement de l'application  

Ce dépôt contient le code associé à la vidéo 👉 [YouTube](https://youtu.be/y3K4hji9W8g).  

## Prérequis  

L'application repose sur **quatre blocs**, deux sont optionnels, ils permettent de stocker les conversations. Voici la liste des blocs :  

✅ **Frontend** : Application en **React.js**  
✅ **LLM** : Modèle déployé en local ou sur une instance louée chez un fournisseur cloud  
🟡 **API** (optionnel) : Backend en **Express.js**  
🟡 **Base de données** (optionnel) : **MongoDB** pour stocker les conversations  

## Déploiement  


### 1️⃣ Déploiement du LLM  

Je recommande de suivre la vidéo pour plus de détails, voici les grandes lignes :  

Si vous louez une instance GPU chez **Scaleway, OVH, AWS ou GCP**, connectez-vous en **SSH**, puis exécutez la commande suivante pour lancer un modèle avec **vLLM** :  

```bash
docker run --runtime nvidia --gpus all     -v ~/.cache/huggingface:/root/.cache/huggingface     -p 8000:8000     --ipc=host     vllm/vllm-openai:latest     --model modelName1     --max-model-len 10000
```

**Paramètres clés** :  
- **`--model modelName1`** : Remplacez par le modèle souhaité en fonction de vos besoins et de la puissance de votre machine, vous trouverez un très grand nombre de modèles sur [Hugging Face](https://huggingface.co/models).  
- **`--max-model-len 10000`** : Ajustez en fonction des capacités de votre instance.  

### Ajouter un second modèle  

Si vous souhaitez un **modèle de réflexion** comme ce qui est fait chez DeepSeek, vous pouvez lancer un **second modèle** :  

#### Sur la **même instance** (si la capacité le permet)  

```bash
docker run --runtime nvidia --gpus all     -v ~/.cache/huggingface:/root/.cache/huggingface     -p 8001:8000     --ipc=host     vllm/vllm-openai:latest     --model modelName2     --max-model-len 10000
```

#### Sur **une autre instance** (si la première est trop limitée)  
```bash
docker run --runtime nvidia --gpus all     -v ~/.cache/huggingface:/root/.cache/huggingface     -p 8000:8000     --ipc=host     vllm/vllm-openai:latest     --model modelName2     --max-model-len 10000
```

**Paramètres clés** :  
- **`--model modelName2`** : Remplacez par le modèle souhaité en fonction de vos besoins et de la puissance de votre machine, vous trouverez un très grand nombre de modèles sur [Hugging Face](https://huggingface.co/models).  
- **`--max-model-len 10000`** : Ajustez en fonction des capacités de votre instance.  

### 2️⃣Déploiement du Frontend  

Rendez-vous dans le fichier DeepseekInput.jsx qui se trouve dans front/src/. Dans ce fichier vous devez renseigner les variables : **modelName1**, **modelName2**, **baseModelUrl1**, **baseModelUrl2**. baseModelUrl1 et baseModelUrl2 sont de la forme adresse "ip de l'instance":"port exposé" (par exemple http://51.159.135.40:8000).

Il vous reste plus qu'à lancer l'application avec les commandes suivantes:

```bash
cd front
npm install
npm run dev
```

Par défaut, l'application tourne sur **localhost:5173**.


### 3️⃣ (Optionnel) Stockage des conversations avec MongoDB  

Si vous souhaitez **mémoriser les conversations**, vous avez besoin de :  
- Une **base de données MongoDB** (MongoDB Atlas recommandé)  
- Une **API** pour faire le lien entre le front et la base de données  

#### Configuration de MongoDB Atlas  

1. Créez un **cluster**, un **utilisateur admin** et un **mot de passe**.  
2. Récupérez l'**URL de connexion** et placez-la dans un fichier **.env** que vous devez créer dans le dossier  `api` et nommez cette variable MONGODB_URL.  
3. Créez un utilisateur dans la collection **users**. Vous avez seulement besoin de renseigner le **username**, mongodb va ensuite créer un id. Cet id il faut le récupérer et le stocker dans la variable **userId** qui se trouve dans front/App.jsx.

#### Déploiement de l’API  
Pour déployer l'api exécutez les commandes suivantes.

```bash
cd api
npm install
npm run dev
```

## Accès à l’application  

Une fois tout déployé, rendez-vous sur **localhost:5173** et commencez à interagir avec vos LLMs ! 🚀
