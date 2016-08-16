node {
    stage 'Checkout'
    checkout scm

    stage 'Build'
    def nodeHome = tool 'nodejs6'
    env.PATH="${env.PATH}:${nodeHome}/bin"

    sh 'npm cache clean'
    sh 'npm install'
    sh 'npm run grunt'

    stage 'Stage Archive'
    step([$class: 'ArtifactArchiver', artifacts: 'dist/**/*', fingerprint: true])

    if (env.BRANCH_NAME == 'master') {
        stage 'Deploy'
        sshagent(credentials: ['deeeb519-0366-4e72-9e1e-caf3d3e05f97']) {
            sh 'scp -o StrictHostKeyChecking=no -r dist/* jenkins@chef.gesundkrank.de:/var/www/anycook'
            sh 'ssh -o StrictHostKeyChecking=no jenkins@chef.gesundkrank.de chmod -R 775 /var/www/anycook/*'
        }
    }
}
